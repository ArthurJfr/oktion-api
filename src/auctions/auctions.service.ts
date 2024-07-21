import { Product, ProductDocument } from './../products/schemas/product.schema';
import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Delete } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auction, AuctionDocument, AuctionType } from './schemas/auction.schema';
import { CreateAuctionDto } from './dto/create-auction.dto';
 
import { PlaceBidDto } from './dto/place-bid.dto';
import Stripe from 'stripe';

@Injectable()
export class AuctionsService {
  
    private stripe: Stripe;
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
  }

  async create(createAuctionDto: CreateAuctionDto, userId: string): Promise<Auction> {
    const { productId, startDate, endDate } = createAuctionDto;

    const activeAuctionsCount = await this.countActiveAuctionsByUser(userId);
    if (activeAuctionsCount >= 3) {
      throw new ForbiddenException('Vous ne pouvez avoir que 3 enchères actives simultanément.');
    }

    // Validation de la durée de l'enchère
    const duration = new Date(endDate).getTime() - new Date(startDate).getTime();
    const minDuration = 12 * 60 * 60 * 1000; // 12 heures en millisecondes
    const maxDuration = 7 * 24 * 60 * 60 * 1000; // 1 semaine en millisecondes
    if (duration < minDuration || duration > maxDuration) {
      throw new BadRequestException('La durée de l\'enchère doit être entre 12 heures et 1 semaine.');
    }

    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new BadRequestException('Produit non trouvé.');
    }

    const createdAuction = new this.auctionModel({ ...createAuctionDto, userId, highestBid : product.startingPrice });
    return createdAuction.save();
  }
  async removeProductAndAuctions(productId: string, userId: string): Promise<void> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Produit non trouvé.');
    }
    
    // Supprimer toutes les enchères associées au produit
    await this.auctionModel.deleteMany({ productId }).exec();

    // Supprimer le produit
    await this.productModel.findByIdAndDelete(product._id);
  }
  async countActiveAuctionsByUser(userId: string): Promise<number> {
    const now = new Date();
    return this.auctionModel.countDocuments({ userId, endDate: { $gt: now } }).exec();
  }
  async findAll(): Promise<Auction[]> {
    return this.auctionModel.find().exec();
  }

  async findOne(id: string): Promise<Auction> {
    return this.auctionModel.findById(id).exec();
  }
  async findByProductId(productId: string): Promise<Auction[]> {
    return this.auctionModel.find({ productId }).exec();
  }


  // Remove produit et enchère associée 
  async remove(id: string): Promise<void> {
    const auction = await this.auctionModel.findById(id);
    if (!auction) {
      throw new NotFoundException('Enchère non trouvée');
    }
    await this.auctionModel.findByIdAndDelete(id);
    await this.productModel.findByIdAndDelete(auction.productId);
  }


  async findOngoingAuctions(): Promise<any[]> {
    const now = new Date();
    const auctions = await this.auctionModel.find({ startDate: { $lte: now }, endDate: { $gte: now } }).exec();
    const detailedAuctions = await Promise.all(
      auctions.map(async (auction) => {
        const product = await this.productModel.findById(auction.productId).exec();
        return { auction, product };
      }),
    );
    return detailedAuctions;
  }

  async findUpcomingAuctions(): Promise<any[]> {
    const now = new Date();
    const auctions = await this.auctionModel.find({ startDate: { $gt: now } }).exec();
    const detailedAuctions = await Promise.all(
      auctions.map(async (auction) => {
        const product = await this.productModel.findById(auction.productId).exec();
        return { auction, product };
      }),
    );
    return detailedAuctions;
  }

  async findEndingSoonAuctions(): Promise<any[]> {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000); // 1 heure à partir de maintenant
    const auctions = await this.auctionModel.find({ endDate: { $gt: now, $lt: oneHourFromNow } }).exec();
    const detailedAuctions = await Promise.all(
      auctions.map(async (auction) => {
        const product = await this.productModel.findById(auction.productId).exec();
        return { auction, product };
      }),
    );
    return detailedAuctions;
  }

  // Placer une enchère

  async placeBid(id: string, placeBidDto: PlaceBidDto, userId: string): Promise<Auction> {
    const auction = await this.auctionModel.findById(id);

    if (!auction) {
      throw new BadRequestException('Enchère non trouvée.');
    }

    const { amount } = placeBidDto;

    if (auction.type === AuctionType.BLIND) {
      const existingBid = auction.bids.find(bid => bid.userId === userId);
      if (existingBid) {
        throw new BadRequestException('Vous ne pouvez placer qu\'une seule offre sur une enchère à l\'aveugle.');
      }
    }

    if (auction.type === AuctionType.TRADITIONAL && amount <= auction.highestBid) {
      throw new BadRequestException('Votre offre doit être supérieure à l\'offre actuelle.');
    }

    auction.bids.push({ userId, amount, date: new Date() });

    if (amount > auction.highestBid) {
      auction.highestBid = amount;
      auction.highestBidder = userId;
    }

    return auction.save();
  }



  // Partie Payment
  async processPayment(auctionId: string): Promise<void> {
    const auction = await this.auctionModel.findById(auctionId);
    if (!auction) {
      throw new NotFoundException('Enchère non trouvée');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: auction.highestBid * 100, // Montant en centimes
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: { auctionId: auctionId, highestBidder: auction.highestBidder },
    });

    auction.paymentIntentId = paymentIntent.id;
    await auction.save();
  }

  async confirmPayment(paymentIntentId: string): Promise<void> {
    const auction = await this.auctionModel.findOne({ paymentIntentId });
    if (!auction) {
      throw new NotFoundException('Enchère non trouvée');
    }

    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Le paiement n\'a pas été confirmé');
    }

    auction.isPaid = true;
    await auction.save();
  }
}

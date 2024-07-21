import { Product, ProductSchema } from './../products/schemas/product.schema';
import { Module  } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { Auction, AuctionSchema } from './schemas/auction.schema';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), 
   
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService],
   exports: [MongooseModule],
})
export class AuctionsModule {}

import { Controller, Get, Post, Body, Param, UseGuards,  Delete } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { Auction } from './schemas/auction.schema';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/get-user.decorator';
import { PlaceBidDto } from './dto/place-bid.dto';



@Controller('auctions')
@UseGuards(AuthGuard('jwt'))
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  async create(@CurrentUser() user, @Body() createAuctionDto: CreateAuctionDto): Promise<Auction> {
    return this.auctionsService.create(createAuctionDto, user.userId);
  }
  @Delete('removeprod/:productId')
  async removeProductAndAuctions(@Param('productId') productId: string, @CurrentUser() user) {
    return this.auctionsService.removeProductAndAuctions(productId, user.userId);
  }
  @Get()
  async findAll(): Promise<Auction[]> {
    return this.auctionsService.findAll();
  }

  @Get('findbyproduct/:id')
  async findByProductId(@Param('id') id: string): Promise<Auction[]> {
    return this.auctionsService.findByProductId(id);
  }

  @Get('ongoing')
  async getOngoingAuctions() {
    return this.auctionsService.findOngoingAuctions();
  }

  @Get('upcoming')
  async getUpcomingAuctions() {
    return this.auctionsService.findUpcomingAuctions();
  }

  @Get('ending-soon')
  async getEndingSoonAuctions() {
    return this.auctionsService.findEndingSoonAuctions();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Auction> {
    return this.auctionsService.findOne(id);
  }

  @Post(':id/bid')
  async placeBid(@Param('id') id: string, @Body() placeBidDto: PlaceBidDto, @CurrentUser() user) {
    return this.auctionsService.placeBid(id, placeBidDto, user.userId);
  }
}

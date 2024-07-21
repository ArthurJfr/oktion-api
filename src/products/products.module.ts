import { Auction, AuctionSchema} from './../auctions/schemas/auction.schema';
import { AuctionsModule } from 'src/auctions/auctions.module';
import { Module  } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
  MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  AuctionsModule,
],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}

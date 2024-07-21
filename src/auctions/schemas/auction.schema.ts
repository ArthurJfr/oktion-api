import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuctionDocument = Auction & Document;

  export enum AuctionType {
    TRADITIONAL = 'traditional',
    BLIND = 'blind',
  }

@Schema()
export class Auction {


  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: String, enum: AuctionType, default: AuctionType.TRADITIONAL }) // Ajoutez cette ligne
  type: AuctionType;

  @Prop({ type: [{ userId: String, amount: Number, date: Date }], default: [] })
  bids: { userId: string; amount: number; date: Date }[];

  @Prop({ type: String, default: null })
  highestBidder: string;

  @Prop({ type: Number, default: 0 })
  highestBid: number;

  @Prop({ type: String, default: null })
  paymentIntentId: string;

  @Prop({ type: Boolean, default: false }) 
  isPaid: boolean;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
 
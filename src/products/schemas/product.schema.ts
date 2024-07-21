import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  category: string;

  @Prop({ required: true })
  startingPrice: number;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;

  @Prop({ required: true })
  userId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
 
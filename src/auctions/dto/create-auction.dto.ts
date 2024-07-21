import { IsNotEmpty, IsDateString, IsEnum, IsNumberString } from 'class-validator';
import { AuctionType } from '../schemas/auction.schema';

export class CreateAuctionDto {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  @IsEnum(AuctionType)
  type: AuctionType;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

}

import { IsNotEmpty, IsNumberString } from 'class-validator';

export class PlaceBidDto {
  @IsNotEmpty()
  @IsNumberString()
  amount: number;
}

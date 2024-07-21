import { IsNotEmpty, IsOptional, IsNumberString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  category?: string;

  @IsNotEmpty()
  @IsNumberString()
  startingPrice: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  imageUrl?: string;
}

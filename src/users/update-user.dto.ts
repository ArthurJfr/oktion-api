import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;
}

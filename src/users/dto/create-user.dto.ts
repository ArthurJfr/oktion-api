import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au minimum 8 caractères' })
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' })
  readonly password: string;

  
}

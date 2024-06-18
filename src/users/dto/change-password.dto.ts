import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(8, { message: 'Password is too short. Minimal length is $constraint1 characters.' })
  @MaxLength(20, { message: 'Password is too long. Maximal length is $constraint1 characters.' })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, { message: 'Password too weak' })
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: 'Password is too short. Minimal length is $constraint1 characters.' })
  @MaxLength(20, { message: 'Password is too long. Maximal length is $constraint1 characters.' })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, { message: 'Password too weak' })
  newPassword: string;
}

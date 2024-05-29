import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'The username must be at least 6 characters long' })
  username: string;

  @MinLength(6, { message: 'The password must be at least 6 characters long' })
  password: string;
}

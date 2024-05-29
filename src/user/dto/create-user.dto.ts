import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @MaxLength(255, {
    message: "Email can't be longer than 255 characters",
  })
  email: string;

  @MinLength(6, { message: 'The username must be at least 6 characters long' })
  @MaxLength(36, {
    message: "Username can't be longer than 36 characters",
  })
  username: string;

  @MinLength(6, { message: 'The password must be at least 6 characters long' })
  password: string;
}

import { IsEmail, MaxLength } from 'class-validator';

export class EmailDto {
  @IsEmail()
  @MaxLength(255, {
    message: "Email can't be longer than 255 characters",
  })
  email: string;
}

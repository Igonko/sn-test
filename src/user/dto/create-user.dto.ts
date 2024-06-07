import { MaxLength, MinLength } from 'class-validator';
import { EmailDto } from 'src/common/dtos/email.dto';

export class CreateUserDto extends EmailDto {
  @MinLength(6, { message: 'The username must be at least 6 characters long' })
  @MaxLength(36, {
    message: "Username can't be longer than 36 characters",
  })
  username: string;

  @MinLength(6, { message: 'The password must be at least 6 characters long' })
  password: string;
}

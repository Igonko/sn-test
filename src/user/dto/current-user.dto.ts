import { EmailDto } from 'src/common/dtos/email.dto';

export class CurrentUserDto extends EmailDto {
  id: number;
  username: string;
  confirmed: boolean;
}

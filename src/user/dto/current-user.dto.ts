import { EmailDto } from 'src/common/dtos/email.dto';
import { Customer } from 'src/stripe/entities/customer.entity';

export class CurrentUserDto extends EmailDto {
  id: number;
  username: string;
  confirmed: boolean;
  customer: Customer;
}

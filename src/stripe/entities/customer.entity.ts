import { Exclude } from 'class-transformer';
import { EntityAutoDateAndId } from 'src/common/entities/entities';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity('customer')
export class Customer extends EntityAutoDateAndId {
  @Column({
    name: 'customer_id',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  customerId: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'default_payment_method', nullable: true })
  defaultPaymentMethod: string;

  @Column({ name: 'created' })
  created: number;

  @Column({ name: 'invoice_prefix', nullable: true })
  invoicePrefix: string;

  @Column({ name: 'delinquent', default: false })
  delinquent: boolean;

  @OneToOne(() => User, ({ customer }) => customer)
  @Exclude()
  user: User;
}

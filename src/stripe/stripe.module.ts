import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, User]),
    ConfigModule,
    UserModule,
    PassportModule.register({ defaultStrategy: 'cognitoJwtStrategy' }),
  ],
  controllers: [StripeController],
  providers: [ConfigService, StripeService],
  exports: [StripeService],
})
export class StripeModule {}

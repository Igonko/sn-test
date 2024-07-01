import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateCustomerDto, CreateSubscriptionDto } from './dto/stripe.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-customer')
  public async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    const { email, paymentMethodId } = createCustomerDto;
    const customer = await this.stripeService.createCustomer(
      email,
      paymentMethodId,
    );
    return customer;
  }

  @Post('create-subscription')
  public async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    const { customerId, priceId } = createSubscriptionDto;
    const subscription = await this.stripeService.createSubscription(
      customerId,
      priceId,
    );
    return subscription;
  }
}

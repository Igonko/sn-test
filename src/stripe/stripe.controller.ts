import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateCustomerDto, CreateSubscriptionDto } from './dto/stripe.dto';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { CognitoJwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUserDto } from 'src/user/dto/current-user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-customer')
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  public async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    const { email, paymentMethodId } = createCustomerDto;
    const customer = await this.stripeService.createCustomer(
      email,
      paymentMethodId,
    );
    return customer;
  }

  @Post('create-subscription')
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  public async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const { priceId } = createSubscriptionDto;
    const customerId = user.customer.customerId;

    const subscription = await this.stripeService.createSubscription(
      customerId,
      priceId,
    );

    return subscription;
  }

  @Get('subscription/:id')
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  public async getSubscription(@Param('id') subscriptionId: string) {
    return this.stripeService.getSubscription(subscriptionId);
  }

  @Delete('subscription/:id')
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  public async cancelSubscription(@Param('id') subscriptionId: string) {
    return this.stripeService.cancelSubscription(subscriptionId);
  }
}

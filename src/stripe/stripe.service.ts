import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { classToPlain } from 'class-transformer';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2024-06-20',
      },
    );
  }

  public async createCustomer(email: string, paymentMethodId: string) {
    try {
      const customer = await this.stripe.customers.create({
        email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const savedCustomer = await this.customerRepository.save({
        customerId: customer.id,
        email: customer.email,
        defaultPaymentMethod: customer.invoice_settings
          .default_payment_method as string,
        created: customer.created,
        invoicePrefix: customer.invoice_prefix,
        delinquent: customer.delinquent,
        user: {
          id: user.id,
          username: user.username,
          avatarId: 12,
        },
      });

      user.customer = savedCustomer;

      await this.userRepository.save(user);

      return classToPlain(savedCustomer);
    } catch (error) {
      throw error;
    }
  }

  public async createSubscription(customerId: string, priceId: string) {
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    const customer = await this.customerRepository.findOne({
      where: { customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    customer.subscription = subscription.id;

    await this.customerRepository.save(customer);

    return subscription;
  }

  public async getSubscription(subscriptionId: string) {
    const subscription =
      await this.stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  }

  public async cancelSubscription(subscriptionId: string) {
    const cancellation = await this.stripe.subscriptions.cancel(subscriptionId);
    const customer = await this.customerRepository.findOne({
      where: { subscription: subscriptionId },
    });

    customer.subscription = null;
    await this.customerRepository.save(customer);

    return cancellation;
  }
}

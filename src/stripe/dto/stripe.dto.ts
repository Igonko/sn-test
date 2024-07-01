export class CreateCustomerDto {
  paymentMethodId: string;
  email: string;
}

export class CreateSubscriptionDto {
  customerId: string;
  priceId: string;
}

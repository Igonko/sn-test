export class ConfirmAuthDto {
  email: string;
  confirmationCode: string;
}

export class SignInAuthDto {
  email: string;
  password: string;
}

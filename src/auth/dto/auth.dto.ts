export class ConfirmAuthDto {
  email: string;
  confirmationCode: string;
}

export class SignInAuthDto {
  email: string;
  password: string;
}

export class ConfirmForgotPasswordDto {
  email: string;
  confirmationCode: string;
  password: string;
}

export class ChangePasswordDto {
  token: string;
  previousPassword: string;
  proposedPassword: string;
}

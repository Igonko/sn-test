import { ApiProperty } from '@nestjs/swagger';

export class ConfirmAuthDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  confirmationCode: string;
}

export class SignInAuthDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class ConfirmForgotPasswordDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  confirmationCode: string;

  @ApiProperty()
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  previousPassword: string;

  @ApiProperty()
  proposedPassword: string;
}

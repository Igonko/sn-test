import { Injectable } from '@nestjs/common';
import {
  ChangePasswordDto,
  ConfirmAuthDto,
  ConfirmForgotPasswordDto,
  SignInAuthDto,
} from './dto/auth.dto';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly awsCognitoService: AwsCognitoService,
  ) {}

  public async confirm(confirmAuthDto: ConfirmAuthDto) {
    const { email, confirmationCode } = confirmAuthDto;
    return await this.userService.updateConfirm(email, confirmationCode);
  }

  public async forgotPassword(email: string) {
    const user = await this.userService.getUserByEmail(email);
    return await this.awsCognitoService.forgotPassword(email, user.username);
  }

  public async confirmForgotPassword(
    confirmForgotPasswordDto: ConfirmForgotPasswordDto,
  ) {
    return await this.awsCognitoService.confirmForgotPawwsord(
      confirmForgotPasswordDto,
    );
  }

  public async changePassword(changePasswordDto: ChangePasswordDto) {
    return await this.awsCognitoService.changePassword(changePasswordDto);
  }

  public async signIn(signInAuthDto: SignInAuthDto) {
    const user = await this.userService.getUserByEmail(signInAuthDto.email);
    const { confirmed, ...userData } = user;
    if (!confirmed) {
      return await this.awsCognitoService.resendConfirmationCode(
        signInAuthDto.email,
      );
    }

    const keys = await this.awsCognitoService.signIn(signInAuthDto);
    return { ...keys, ...userData };
  }
}

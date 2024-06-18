import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ConfirmAuthDto,
  ConfirmForgotPasswordDto,
  SignInAuthDto,
} from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('confirm')
  async confirm(@Body() confirmAuthDto: ConfirmAuthDto) {
    return await this.authService.confirm(confirmAuthDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email }: { email: string }) {
    return await this.authService.forgotPassword(email);
  }

  @Post('confirm-forgot-password')
  async confirmForgotPassword(
    @Body() confirmForgotPasswordDto: ConfirmForgotPasswordDto,
  ) {
    return await this.authService.confirmForgotPassword(
      confirmForgotPasswordDto,
    );
  }

  @Post('change-password')
  async changePassword(@Body() changePassword: ChangePasswordDto) {
    return await this.authService.changePassword(changePassword);
  }

  @Post('sign-in')
  async signIn(@Body() signInAuthDto: SignInAuthDto) {
    return await this.authService.signIn(signInAuthDto);
  }
}

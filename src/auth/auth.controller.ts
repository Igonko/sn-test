import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmAuthDto, SignInAuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('confirm')
  confirm(@Body() confirmAuthDto: ConfirmAuthDto) {
    return this.authService.confirm(confirmAuthDto);
  }

  @Post('signin')
  async signIn(@Body() signInAuthDto: SignInAuthDto) {
    return await this.authService.signIn(signInAuthDto);
  }
}

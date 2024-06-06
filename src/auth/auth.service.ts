import { Injectable } from '@nestjs/common';
import { ConfirmAuthDto, SignInAuthDto } from './dto/auth.dto';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';

@Injectable()
export class AuthService {
  constructor(private readonly awsCognitoService: AwsCognitoService) {}

  public async confirm(confirmAuthDto: ConfirmAuthDto) {
    const { email, confirmationCode } = confirmAuthDto;
    return await this.awsCognitoService.confirmUser(email, confirmationCode);
  }

  public async signIn(signInAuthDto: SignInAuthDto) {
    return await this.awsCognitoService.signIn(signInAuthDto);
  }
}

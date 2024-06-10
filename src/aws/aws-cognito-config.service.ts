import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsCognitoConfigService {
  constructor(private readonly configService: ConfigService) {}

  getUserConfig() {
    return {
      userPoolId: this.configService.get<string>('AWS_COGNITO_USER_POOL_ID'),
      clientId: this.configService.get<string>('AWS_COGNITO_USER_CLIENT_ID'),
      authority: this.configService.get<string>('COGNITO_AUTHORITY'),
    };
  }
}

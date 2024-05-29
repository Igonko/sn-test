import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  private readonly cognito;

  constructor(private configService: ConfigService) {
    this.cognito = new AWS.CognitoIdentityServiceProvider({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async registerUser(email: string, password: string): Promise<string> {
    const params = {
      ClientId: this.configService.get<string>('AWS_COGNITO_USER_CLIENT_ID'),
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    };

    try {
      const result = await this.cognito.signUp(params).promise();
      console.log(result);
      return result.UserSub; // Cognito user ID
    } catch (error) {
      throw new InternalServerErrorException(
        'Error registering user with Cognito',
      );
    }
  }

  async deleteUser(email: string): Promise<void> {
    const params = {
      UserPoolId: this.configService.get<string>('AWS_COGNITO_USER_POOL_ID'),
      Username: email,
    };

    try {
      await this.cognito.adminDeleteUser(params).promise();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error deleting user from Cognito',
      );
    }
  }
}

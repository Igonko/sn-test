import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { SignInAuthDto } from 'src/auth/dto/auth.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AwsCognitoService {
  private readonly cognito;

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    this.cognito = new AWS.CognitoIdentityServiceProvider({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  public async registerUser(email: string, password: string): Promise<string> {
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
      return result.UserSub;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error registering user with Cognito: ${error}`,
      );
    }
  }

  public async deleteUser(email: string): Promise<void> {
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

  public async confirmUser(email: string, confirmationCode: string) {
    const params = {
      ClientId: this.configService.get<string>('AWS_COGNITO_USER_CLIENT_ID'),
      Username: email,
      ConfirmationCode: confirmationCode,
    };

    try {
      await this.cognito.confirmSignUp(params).promise();

      return await this.userService.updateConfirm(email, true);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error confirming user with Cognito: ${error}`,
      );
    }
  }

  public async signIn(signInAuthDto: SignInAuthDto) {
    const { email, password } = signInAuthDto;
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.configService.get<string>('AWS_COGNITO_USER_CLIENT_ID'),
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    try {
      const result = await this.cognito.initiateAuth(params).promise();
      return {
        accessToken: result.AuthenticationResult.AccessToken,
        idToken: result.AuthenticationResult.IdToken,
        refreshToken: result.AuthenticationResult.RefreshToken,
      };
    } catch (error) {
      if (
        error.code === 'NotAuthorizedException' ||
        error.code === 'UserNotFoundException'
      ) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw new InternalServerErrorException(
        `Error signing in user with Cognito: ${error}`,
      );
    }
  }
}

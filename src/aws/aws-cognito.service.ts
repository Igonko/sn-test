import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminDeleteUserCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  AuthFlowType,
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ChangePasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ChangePasswordDto,
  ConfirmForgotPasswordDto,
  SignInAuthDto,
} from 'src/auth/dto/auth.dto';

@Injectable()
export class AwsCognitoService {
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor(private configService: ConfigService) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
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
      const command = new SignUpCommand(params);
      const result = await this.cognitoClient.send(command);
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
      const command = new AdminDeleteUserCommand(params);
      await this.cognitoClient.send(command);
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
      const command = new ConfirmSignUpCommand(params);
      await this.cognitoClient.send(command);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error confirming user with Cognito: ${error}`,
      );
    }
  }

  public async resendConfirmationCode(email: string) {
    const params = {
      ClientId: this.configService.get<string>('AWS_COGNITO_USER_CLIENT_ID'),
      Username: email,
    };
    try {
      const command = new ResendConfirmationCodeCommand(params);
      return await this.cognitoClient.send(command);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error resend confirmation code: ${error}`,
      );
    }
  }

  public async signIn(signInAuthDto: SignInAuthDto) {
    const { email, password } = signInAuthDto;
    const params = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: this.configService.get<string>('AWS_COGNITO_USER_CLIENT_ID'),
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    try {
      const command = new InitiateAuthCommand(params);
      const result = await this.cognitoClient.send(command);
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

  public async forgotPassword(email: string, firstName: string) {
    const params = {
      ClientId: this.configService.get<string>('AWS_COGNITO_USER_CLIENT_ID'),
      Username: email,
      ClientMetadata: {
        firstName,
      },
    };

    try {
      const command = new ForgotPasswordCommand(params);
      return await this.cognitoClient.send(command);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error forgot password command: ${error}`,
      );
    }
  }

  public async confirmForgotPawwsord(
    confirmForgotPasswordDto: ConfirmForgotPasswordDto,
  ) {
    const params = {
      ClientId: this.configService.get<string>('AWS_COGNITO_USER_CLIENT_ID'),
      Username: confirmForgotPasswordDto.email,
      ConfirmationCode: confirmForgotPasswordDto.confirmationCode,
      Password: confirmForgotPasswordDto.password,
    };

    try {
      const command = new ConfirmForgotPasswordCommand(params);
      return await this.cognitoClient.send(command);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error confirming password with Cognito: ${error}`,
      );
    }
  }

  public async changePassword(changePasswordDto: ChangePasswordDto) {
    const params = {
      PreviousPassword: changePasswordDto.previousPassword,
      ProposedPassword: changePasswordDto.proposedPassword,
      AccessToken: changePasswordDto.token,
    };

    try {
      const command = new ChangePasswordCommand(params);
      await this.cognitoClient.send(command);
      return 'Password successfully changed';
    } catch (error) {
      throw new InternalServerErrorException(
        `Error change password command: ${error}`,
      );
    }
  }
}

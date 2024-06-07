import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const client = new CognitoIdentityProviderClient({});
      const command = new GetUserCommand({
        AccessToken: token,
      });
      const result = await client.send(command);

      if (result.Username) {
        request.user = result;
        return true;
      }

      throw new UnauthorizedException('Invalid token');
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

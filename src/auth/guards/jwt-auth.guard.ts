import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class CognitoJwtAuthGuard extends AuthGuard('cognitoJwtStrategy') {
  public override getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}

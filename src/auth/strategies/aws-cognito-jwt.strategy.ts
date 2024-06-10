import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AwsCognitoConfigService } from '../../aws/aws-cognito-config.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CognitoJwtStrategy extends PassportStrategy(
  Strategy,
  'cognitoJwtStrategy',
) {
  constructor(
    awsCognitoConfigService: AwsCognitoConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: `${
          awsCognitoConfigService.getUserConfig().authority
        }/.well-known/jwks.json`,
      }),
    });
  }

  public async validate(payload: Record<string, any>) {
    if (!payload) {
      throw new UnauthorizedException();
    }

    return this.userService.getUser(payload.sub);
  }
}

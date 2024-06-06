import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { AwsModule } from 'src/aws/aws.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ConfigModule, AwsModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, AwsCognitoService],
})
export class AuthModule {}

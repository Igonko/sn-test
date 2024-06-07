import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsCognitoService } from './aws-cognito.service';

@Module({
  imports: [ConfigModule],
  providers: [AwsCognitoService],
  exports: [AwsCognitoService],
})
export class AwsModule {}

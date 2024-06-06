import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsCognitoService } from './aws-cognito.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [forwardRef(() => UserModule), ConfigModule],
  providers: [AwsCognitoService],
  exports: [AwsCognitoService],
})
export class AwsModule {}

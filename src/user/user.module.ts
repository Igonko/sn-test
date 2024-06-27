import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsModule } from 'src/aws/aws.module';
import { PassportModule } from '@nestjs/passport';
import { AwsCognitoConfigService } from 'src/aws/aws-cognito-config.service';
import { CognitoJwtStrategy } from 'src/auth/strategies/aws-cognito-jwt.strategy';
import { DbFileModule } from 'src/dbFile/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    AwsModule,
    DbFileModule,
    PassportModule.register({ defaultStrategy: 'cognitoJwtStrategy' }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    ConfigService,
    AwsCognitoConfigService,
    CognitoJwtStrategy,
  ],
  exports: [UserService],
})
export class UserModule {}

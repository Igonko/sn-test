import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserDto } from './dto/current-user.dto';
import { CognitoJwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import 'multer';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('avatar')
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @CurrentUser() user: CurrentUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.addAvatar(user.id, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ status: 200, description: 'Return user.' })
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  async getUser(@CurrentUser() user: CurrentUserDto) {
    return user;
  }
}

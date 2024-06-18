import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
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

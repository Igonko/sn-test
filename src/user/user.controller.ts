import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() request) {
    const user = request.user;

    [
      { Name: 'email', Value: 'dagina9156@kernuo.com' },
      { Name: 'email_verified', Value: 'true' },
      { Name: 'sub', Value: 'c3b45882-1091-70d7-9331-2f47a' },
    ];

    const cognitoId = user.UserAttributes.find(
      (item) => item.Name === 'sub',
    )?.Value;

    return await this.userService.getUser(cognitoId);
  }
}

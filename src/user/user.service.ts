import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AwsService } from '../aws/aws.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly awsService: AwsService,
  ) {}

  private async existUser(createUserDto: CreateUserDto) {
    const isUserExist = await this.userRepository.findOne({
      where: [
        {
          email: createUserDto.email,
        },
        {
          username: createUserDto.username,
        },
      ],
    });

    if (isUserExist)
      throw new BadRequestException(
        'User with this email/username already exists',
      );
  }

  async create(createUserDto: CreateUserDto) {
    await this.existUser(createUserDto);

    const cognitoUserId = await this.awsService.registerUser(
      createUserDto.email,
      createUserDto.password,
    );

    try {
      const user = await this.userRepository.save({
        email: createUserDto.email,
        username: createUserDto.username,
        cognitoId: cognitoUserId,
      });

      return user;
    } catch (error) {
      await this.awsService.deleteUser(createUserDto.email);
      throw error;
    }
  }

  // findAll() {
  //   return `This action returns all user`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}

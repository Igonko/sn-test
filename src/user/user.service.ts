import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AwsCognitoService } from '../aws/aws-cognito.service';
import { Repository } from 'typeorm';
import { classToPlain } from 'class-transformer';
import { MinioService } from 'src/minio/minio.service';
import Minio from 'src/minio/enteties/minio.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AwsCognitoService))
    private readonly awsCognitoService: AwsCognitoService,
    @Inject(forwardRef(() => MinioService))
    private readonly minioService: MinioService,
  ) {}

  private async existUser(createUserDto: CreateUserDto) {
    const isUserExist = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: createUserDto.email })
      .orWhere('user.username = :username', {
        username: createUserDto.username,
      })
      .getOne();

    if (isUserExist)
      throw new BadRequestException(
        'User with this email/username already exists',
      );
  }

  public async addAvatar(userId: number, file: Express.Multer.File) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: userId })
        .getOne();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const fileData = await this.minioService.uploadFile(file);
      user.avatar = fileData;
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  public async create(createUserDto: CreateUserDto) {
    await this.existUser(createUserDto);

    const cognitoUserId = await this.awsCognitoService.registerUser(
      createUserDto.email,
      createUserDto.password,
    );

    try {
      const user = await this.userRepository.save({
        email: createUserDto.email,
        username: createUserDto.username,
        cognitoId: cognitoUserId,
      });

      return classToPlain(user);
    } catch (error) {
      await this.awsCognitoService.deleteUser(createUserDto.email);
      throw error;
    }
  }

  public async getUser(cognitoId: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .leftJoinAndSelect('user.customer', 'customer')
      .where('user.cognitoId = :cognitoId', { cognitoId })
      .getOne();

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    if (user.avatar?.fileName) {
      const imageLink = await this.minioService.getFile(user.avatar.fileName);
      const plainedUser = classToPlain(user);

      return {
        ...plainedUser,
        avatar: imageLink.url,
      };
    }

    return classToPlain(user);
  }

  public async getUserByEmail(
    email: string,
  ): Promise<(Omit<User, 'avatar'> & { avatar: string }) | User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    if (user.avatar?.fileName) {
      const imageLink = await this.minioService.getFile(user.avatar.fileName);
      const plainedUser = classToPlain(user);

      return {
        ...(plainedUser as Omit<User, 'avatar'>),
        avatar: imageLink.url,
      };
    }

    return classToPlain(user) as User;
  }

  public async updateConfirm(email: string, confirmationCode: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with not found`);
    }

    try {
      await this.awsCognitoService.confirmUser(email, confirmationCode);
      await this.userRepository.update({ email }, { confirmed: true });
      return { ...user, confirmed: true };
    } catch (error) {
      throw new BadRequestException(`Error confirming user sign-up: ${error}`);
    }
  }
}

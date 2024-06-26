import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AwsCognitoService } from '../aws/aws-cognito.service';
import { Connection, Repository } from 'typeorm';
import { classToPlain } from 'class-transformer';
import { DbFileService } from 'src/dbFile/file.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AwsCognitoService))
    private readonly awsCognitoService: AwsCognitoService,
    @Inject(forwardRef(() => DbFileService))
    private readonly dbFileService: DbFileService,
    private connection: Connection,
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

  public async addAvatar(
    userId: number,
    imageBuffer: Buffer,
    filename: string,
  ) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });
      const currentAvatarId = user.avatarId;
      const avatar = await this.dbFileService.uploadDatabaseFileWithQueryRunner(
        imageBuffer,
        filename,
        queryRunner,
      );

      await queryRunner.manager.update(User, userId, {
        avatarId: avatar.id,
      });

      if (currentAvatarId) {
        await this.dbFileService.deleteFileWithQueryRunner(
          currentAvatarId,
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();

      return {
        filename: avatar.filename,
        id: avatar.id,
      };
    } catch {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
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
    const user = await this.userRepository.findOne({
      where: { cognitoId },
      relations: ['avatar', 'customer'],
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    if (user.avatar) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      user.avatar.data = Buffer.from(user.avatar.data).toString('base64');
    }

    return classToPlain(user);
  }

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return classToPlain(user);
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

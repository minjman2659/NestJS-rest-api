import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserEntity } from '@modules/users/user.entity';
import { hashPassword, comparePassword } from '@common/helpers';
import { CreateUserBodyDto, LoginBodyDto } from './dto';
import { TokenService } from '@providers/token';
import { TokenPayload } from '@common/types/token';
import {
  NOT_FOUND_USER,
  DIFFERENT_PW,
  ALREADY_SIGNED_OUT_USER,
  ALREADY_SIGNED_UP_EMAIL,
} from '@common/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private readonly tokenService: TokenService,
  ) {}

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (user && user.isSeceder) {
      throw new ConflictException(ALREADY_SIGNED_OUT_USER);
    }

    if (user) {
      throw new ConflictException(ALREADY_SIGNED_UP_EMAIL);
    }

    return;
  }

  async create(body: CreateUserBodyDto) {
    const { password, email, name, isAdmin } = body;
    const hashedPassword = hashPassword(password);

    await this.findByEmail(email);

    try {
      let accessToken: string = null;
      let refreshToken: string = null;
      await this.dataSource.transaction(async (manager) => {
        const user = new UserEntity();
        user.name = name;
        user.email = email;
        user.password = hashedPassword;
        if (isAdmin) {
          user.isAdmin = isAdmin;
        }
        await manager.save(user);

        const tokenPayload = {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
          isSeceder: user.isSeceder,
        };
        const { accessToken: AT } = await this.tokenService.generateAccessToken(
          tokenPayload,
        );
        const { refreshToken: RT } =
          await this.tokenService.generateRefreshToken(tokenPayload);

        accessToken = AT;
        refreshToken = RT;
      });

      return { accessToken, refreshToken };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async login(body: LoginBodyDto) {
    const { email, password } = body;

    const user = await this.usersRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'name',
        'password',
        'createdAt',
        'updatedAt',
        'isSeceder',
        'isAdmin',
      ],
    });

    if (!user) {
      throw new NotFoundException(NOT_FOUND_USER);
    }

    if (user.isSeceder) {
      throw new ConflictException(ALREADY_SIGNED_OUT_USER);
    }

    if (!comparePassword(password, user.password)) {
      throw new ForbiddenException(DIFFERENT_PW);
    }

    const {
      id,
      email: userEmail,
      name,
      createdAt,
      updatedAt,
      isAdmin,
      isSeceder,
    } = user;
    const userData = { id, email: userEmail, name, createdAt, updatedAt };
    const tokenPayload = {
      id,
      email: userEmail,
      isAdmin,
      isSeceder,
    };

    const { accessToken } = await this.tokenService.generateAccessToken(
      tokenPayload,
    );
    const { refreshToken } = await this.tokenService.generateRefreshToken(
      tokenPayload,
    );

    return { userData, accessToken, refreshToken };
  }

  async signout(user: TokenPayload) {
    if (user.isSeceder) {
      throw new ConflictException(ALREADY_SIGNED_OUT_USER);
    }

    try {
      await this.dataSource.transaction(async (manager) => {
        await manager.update(UserEntity, { id: user.id }, { isSeceder: true });
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}

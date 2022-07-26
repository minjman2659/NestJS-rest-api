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
      throw new ConflictException('탈퇴한 유저입니다.');
    }

    if (user) {
      throw new ConflictException('이미 가입된 이메일 입니다.');
    }

    return { message: '가입 가능한 이메일 입니다.' };
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
      throw new NotFoundException('존재하지 않는 유저 입니다.');
    }

    if (user.isSeceder) {
      throw new ConflictException('탈퇴한 유저입니다.');
    }

    if (!comparePassword(password, user.password)) {
      throw new ForbiddenException('패스워드가 다릅니다.');
    }

    const { id, email: userEmail, name, createdAt, updatedAt, isAdmin } = user;
    const userData = { id, email: userEmail, name, createdAt, updatedAt };
    const tokenPayload = {
      id,
      email: userEmail,
      isAdmin,
    };

    const { accessToken } = await this.tokenService.generateAccessToken(
      tokenPayload,
    );
    const { refreshToken } = await this.tokenService.generateRefreshToken(
      tokenPayload,
    );

    return { userData, accessToken, refreshToken };
  }

  async signout() {
    // 로그인 중인 유저의 아이디를 알아내고,
    // 해당 아이디로 유저 정보를 find 한 뒤,
    // isSeceder의 값을 true로 업데이트한다.
    // refreshToken 쿠키 값을 null로 set 하고,
    // 200 status code와 함께 { accessToken: null } 값을 응답한다.
  }
}

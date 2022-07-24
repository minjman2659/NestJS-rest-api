import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@modules/users/user.entity';
import { hashPassword } from '@common/helpers';
import { CreateUserBodyDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
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
    const { password, ...rest } = body;
    const hashedPassword = hashPassword(password);

    await this.findByEmail(rest.email);

    await this.usersRepository.save({
      ...rest,
      password: hashedPassword,
    });
  }
}

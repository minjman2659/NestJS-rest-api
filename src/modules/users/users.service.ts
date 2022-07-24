import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: {
        posts: {
          id: true,
          title: true,
          content: true,
          thumbnail: true,
          isTemp: true,
        },
      },
      relations: ['posts'],
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    return user;
  }
}

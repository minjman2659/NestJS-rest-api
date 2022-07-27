import { NOT_FOUND_USER } from '@common/constants';
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

  async findAll(page: number, limit: number) {
    const take = limit; // limit
    const skip = (page - 1) * limit; // offset
    const [users, count] = await this.usersRepository.findAndCount({
      select: {
        posts: {
          id: true,
          title: true,
          content: true,
          thumbnail: true,
          isTemp: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take,
      relations: ['posts'],
    });

    return { users, count };
  }

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
      throw new NotFoundException(NOT_FOUND_USER);
    }

    return { user };
  }
}

import { NOT_AUTHOR_OF_POST, NOT_FOUND_POST } from '@common/constants';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateAndUpdatePostBodyDto } from './dto/request';
import { PostEntity } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    private dataSource: DataSource,
  ) {}

  async findAll(page: number, limit: number) {
    const take = limit; // limit
    const skip = (page - 1) * limit; // offset
    const [posts, count] = await this.postsRepository.findAndCount({
      select: {
        user: { name: true, email: true },
      },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take,
      relations: ['user'],
    });

    return { posts, count };
  }

  async findOne(postId: number) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      select: { user: { name: true, email: true } },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(NOT_FOUND_POST);
    }

    return { post };
  }

  async create(body: CreateAndUpdatePostBodyDto, userId: number) {
    const { title, content, thumbnail, isTemp } = body;

    try {
      await this.dataSource.transaction(async (manager) => {
        const post = new PostEntity();
        post.title = title;
        post.content = content;
        post.thumbnail = thumbnail;
        post.isTemp = isTemp;
        post.userId = userId;
        await manager.save(post);
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async update(
    postId: number,
    body: CreateAndUpdatePostBodyDto,
    userId: number,
  ) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException(NOT_FOUND_POST);
    }

    if (post.userId !== userId) {
      throw new ForbiddenException(NOT_AUTHOR_OF_POST);
    }

    await this.postsRepository.update({ id: postId }, { ...body });
  }

  async delete(postId: number, userId: number) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException(NOT_FOUND_POST);
    }

    if (post.userId !== userId) {
      throw new ForbiddenException(NOT_AUTHOR_OF_POST);
    }

    await this.postsRepository.delete({ id: postId });
  }
}

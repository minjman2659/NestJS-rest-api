import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { NOT_AUTHOR_OF_POST, NOT_FOUND_POST } from '@common/constants';
import { PostsService } from '../posts.service';
import { PostEntity } from '../post.entity';
import { CreateAndUpdatePostBodyDto } from '../dto/request';

const createAndUpdateBody: CreateAndUpdatePostBodyDto = {
  title: '제목',
  content: '콘텐츠',
  thumbnail: 'post.png',
  isTemp: false,
};

const posts = [
  {
    id: 1,
    userId: 1,
    title: '포스트 제목',
    content: '포스트 내용',
    thumbnail: '포스트 썸네일',
    isTemp: false,
    createdAt: '2022-07-30T14:33:49.807Z',
    updatedAt: '2022-07-30T14:33:49.807Z',
    user: {
      name: '홍길동',
      email: 'test@test.com',
    },
  },
];

const count = 1;

const postList = [posts, count];

const post = {
  id: 1,
  userId: 1,
  title: '포스트 제목',
  content: '포스트 내용',
  thumbnail: '포스트 썸네일',
  isTemp: false,
  createdAt: '2022-07-30T14:33:49.807Z',
  updatedAt: '2022-07-30T14:33:49.807Z',
  user: {
    name: '홍길동',
    email: 'test@test.com',
  },
};

describe('PostsService', () => {
  let postsService: PostsService;
  let postRepository: Repository<PostEntity>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue(postList),
            findOne: jest.fn().mockResolvedValue(post),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    postRepository = module.get<Repository<PostEntity>>(
      getRepositoryToken(PostEntity),
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(postsService).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return posts and count', async () => {
      const postsData = await postsService.findAll(1, 10);
      expect(postsData).toEqual({ posts, count });
    });
  });

  describe('findOne()', () => {
    describe('[Success]', () => {
      it('should return a post', async () => {
        const postData = await postsService.findOne(1);
        expect(postData).toEqual({ post });
      });
    });
    describe('[Failure]', () => {
      it('should return 404 status code when post is not exist', async () => {
        postRepository.findOne = jest.fn().mockResolvedValue(null);
        const notFoundError = async () => {
          await postsService.findOne(1);
        };
        await expect(notFoundError).rejects.toThrowError(
          new NotFoundException(NOT_FOUND_POST),
        );
      });
    });
  });

  describe('create()', () => {
    it('should create a post', async () => {
      await postsService.create(createAndUpdateBody, 1);
      expect(dataSource.transaction).toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    describe('[Success]', () => {
      it('should update a post', async () => {
        await postsService.update(1, createAndUpdateBody, 1);
        expect(postRepository.update).toHaveBeenCalled();
      });
    });
    describe('[Failure]', () => {
      it('should return 403 status code when post.userId is different from userId', async () => {
        const tempPost = { userId: 2 };
        postRepository.findOne = jest.fn().mockResolvedValue(tempPost);
        const forbiddenError = async () => {
          await postsService.update(1, createAndUpdateBody, 1);
        };
        await expect(forbiddenError).rejects.toThrowError(
          new ForbiddenException(NOT_AUTHOR_OF_POST),
        );
      });
      it('should return 404 status code when post is not exist', async () => {
        postRepository.findOne = jest.fn().mockResolvedValue(null);
        const notFoundError = async () => {
          await postsService.update(1, createAndUpdateBody, 1);
        };
        await expect(notFoundError).rejects.toThrowError(
          new NotFoundException(NOT_FOUND_POST),
        );
      });
    });
  });

  describe('delete()', () => {
    describe('[Success]', () => {
      it('should delete a post', async () => {
        await postsService.delete(1, 1);
        expect(postRepository.delete).toHaveBeenCalled();
      });
    });
    describe('[Failure]', () => {
      it('should return 403 status code when post.userId is different from userId', async () => {
        const tempPost = { userId: 2 };
        postRepository.findOne = jest.fn().mockResolvedValue(tempPost);
        const forbiddenError = async () => {
          await postsService.delete(1, 1);
        };
        await expect(forbiddenError).rejects.toThrowError(
          new ForbiddenException(NOT_AUTHOR_OF_POST),
        );
      });
      it('should return 404 status code when post is not exist', async () => {
        postRepository.findOne = jest.fn().mockResolvedValue(null);
        const notFoundError = async () => {
          await postsService.delete(1, 1);
        };
        await expect(notFoundError).rejects.toThrowError(
          new NotFoundException(NOT_FOUND_POST),
        );
      });
    });
  });
});

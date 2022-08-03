import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';
import { GetPostsQueryDto, CreateAndUpdatePostBodyDto } from '../dto/request';
import { FindAllPostsDto, FindOnePostDto } from '../dto/response';

const findAllQuery: GetPostsQueryDto = {
  page: 1,
  limit: 10,
};

const createAndUpdateBody: CreateAndUpdatePostBodyDto = {
  title: '제목',
  content: '콘텐츠',
  thumbnail: 'post.png',
  isTemp: false,
};

const findAllPostsDto: FindAllPostsDto = {
  statusCode: 200,
  message: 'OK',
  data: {
    posts: [
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
    ],
    count: 1,
  },
};

const findOnePostDto: FindOnePostDto = {
  statusCode: 200,
  message: 'OK',
  data: {
    post: {
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
  },
};

describe('PostsController', () => {
  let postsController: PostsController;
  let postsService: PostsService;
  const request: any = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        PostsService,
        {
          provide: PostsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(findAllPostsDto.data),
            findOne: jest.fn().mockResolvedValue(findOnePostDto.data),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    postsController = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);

    request.user = {
      id: 1,
      email: 'test@test.com',
      isAdmin: true,
      isSeceder: false,
    };
  });

  it('should be defined', () => {
    expect(postsController).toBeDefined();
  });

  describe('findAll()', () => {
    it('should find all posts', () => {
      expect(postsController.findAll(findAllQuery)).resolves.toEqual(
        findAllPostsDto.data,
      );
      expect(postsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should find a post', () => {
      expect(postsController.findOne(1)).resolves.toEqual(findOnePostDto.data);
      expect(postsService.findOne).toHaveBeenCalled();
    });
  });

  describe('create()', () => {
    it('should create a post', async () => {
      await postsController.create(createAndUpdateBody, request);
      expect(postsService.create).toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    it('should update a post', async () => {
      await postsController.update(1, createAndUpdateBody, request);
      expect(postsService.update).toHaveBeenCalled();
    });
  });

  describe('delete()', () => {
    it('should delete a post', async () => {
      await postsController.delete(1, request);
      expect(postsService.delete).toHaveBeenCalled();
    });
  });
});

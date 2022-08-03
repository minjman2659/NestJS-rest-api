import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { FindAllUsersDto, FindOneUserDto } from '../dto/response';
import { GetUsersQueryDto } from '../dto/request';

const findAllQuery: GetUsersQueryDto = {
  page: 1,
  limit: 10,
};

const findAllUsersDto: FindAllUsersDto = {
  statusCode: 200,
  message: 'OK',
  data: {
    users: [
      {
        id: 1,
        name: '홍길동',
        email: 'test@test.com',
        isAdmin: true,
        isSeceder: false,
        createdAt: '2022-07-25T15:42:08.203Z',
        updatedAt: '2022-07-25T15:42:08.203Z',
        posts: [
          {
            id: 1,
            title: '포스트 제목',
            content: '포스트 내용',
            thumbnail: '포스트 썸네일',
            isTemp: false,
          },
        ],
      },
    ],
    count: 1,
  },
};

const findOneUserDto: FindOneUserDto = {
  statusCode: 200,
  message: 'OK',
  data: {
    user: {
      id: 1,
      name: '홍길동',
      email: 'test@test.com',
      isAdmin: true,
      isSeceder: false,
      createdAt: '2022-07-25T15:42:08.203Z',
      updatedAt: '2022-07-25T15:42:08.203Z',
      posts: [
        {
          id: 1,
          title: '포스트 제목',
          content: '포스트 내용',
          thumbnail: '포스트 썸네일',
          isTemp: false,
        },
      ],
    },
  },
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(findAllUsersDto.data),
            findOne: jest.fn().mockResolvedValue(findOneUserDto.data),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('findAll()', () => {
    it('should find all users', () => {
      expect(usersController.findAll(findAllQuery)).resolves.toEqual(
        findAllUsersDto.data,
      );
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should find a user', () => {
      expect(usersController.findOne(1)).resolves.toEqual(findOneUserDto.data);
      expect(usersService.findOne).toHaveBeenCalled();
    });
  });
});

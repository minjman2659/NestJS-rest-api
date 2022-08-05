import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@modules/users/user.entity';
import { NOT_FOUND_USER } from '@common/constants';
import { UsersService } from '../users.service';

const users = [
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
];

const count = 1;

const userList = [users, count];

const user = {
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
};

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue(userList),
            findOne: jest.fn().mockResolvedValue(user),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return users and count', async () => {
      const usersData = await usersService.findAll(1, 10);
      expect(usersData).toEqual({ users, count });
    });
  });

  describe('findOne()', () => {
    describe('[Success]', () => {
      it('should return a user', async () => {
        const userData = await usersService.findOne(1);
        expect(userData).toEqual({ user });
      });
    });
    describe('[Failure]', () => {
      it('should return 404 status code when user is not exist', async () => {
        userRepository.findOne = jest.fn().mockResolvedValue(null);
        const notFoundError = async () => {
          await usersService.findOne(1);
        };
        await expect(notFoundError).rejects.toThrowError(
          new NotFoundException(NOT_FOUND_USER),
        );
      });
    });
  });
});

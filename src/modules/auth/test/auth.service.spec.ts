import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { TokenService } from '@providers/token';
import { TokenPayload } from '@common/types/token';
import { hashPassword } from '@common/helpers';
import {
  ALREADY_SIGNED_OUT_USER,
  ALREADY_SIGNED_UP_EMAIL,
  DIFFERENT_PW,
  NOT_FOUND_USER,
} from '@common/constants';
import { UserEntity } from '@modules/users/user.entity';
import { AuthService } from '../auth.service';
import { CreateUserBodyDto, LoginBodyDto } from '../dto/request';

const createBody: CreateUserBodyDto = {
  email: 'test@test.com',
  name: '홍길동',
  password: '1234',
  isAdmin: true,
};

const loginBody: LoginBodyDto = {
  email: createBody.email,
  password: createBody.password,
};

const user: TokenPayload = {
  id: 1,
  email: createBody.email,
  isAdmin: true,
  isSeceder: false,
};

const userData = {
  id: 1,
  email: 'test@test.com',
  name: '홍길동',
  createdAt: '2022-07-26 22:31:51.914',
  updatedAt: '2022-07-26 22:31:51.914',
  isSeceder: false,
};

const tokenData = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsImVtYWlsIjoibWluam1hbkB0ZXN0MTIzNS5jb20iLCJpc0FkbWluIjpmYWxzZSwiaXNTZWNlZGVyIjpmYWxzZSwiaWF0IjoxNjU5MTcwMjU1LCJleHAiOjE2NTkxNzc0NTUsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCJ9.Qj-KEbxAoYWaDTg4qBe7koXWI32ekfEGR5_b5Rl0DgA',
  refreshToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsImVtYWlsIjoibWluam1hbkB0ZXN0MTIzNS5jb20iLCJpc0FkbWluIjpmYWxzZSwiaXNTZWNlZGVyIjpmYWxzZSwiaWF0IjoxNjU5MTcwMjU1LCJleHAiOjE2NTkxNzc0NTUsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCJ9.Qj-KEbxAoYWaDTg4qBe7koXWI32ekfEGR5_b5Rl0DgA',
};

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: Repository<UserEntity>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userData),
          },
        },
        TokenService,
        {
          provide: TokenService,
          useValue: {
            generateAccessToken: jest
              .fn()
              .mockResolvedValue({ accessToken: tokenData.accessToken }),
            generateRefreshToken: jest
              .fn()
              .mockResolvedValue({ refreshToken: tokenData.refreshToken }),
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

    authService = module.get<AuthService>(AuthService);
    authRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('create()', () => {
    describe('[Success]', () => {
      it('should create a user', async () => {
        authRepository.findOne = jest.fn().mockResolvedValue(null);
        await authService.create(createBody);
        expect(dataSource.transaction).toHaveBeenCalled();
      });
    });
    describe('[Failure]', () => {
      it('should return 409 status code when user.isSeceder is true', async () => {
        authRepository.findOne = jest
          .fn()
          .mockResolvedValue({ ...userData, isSeceder: true });
        const conflictError = async () => {
          await authService.create(createBody);
        };
        await expect(conflictError).rejects.toThrowError(
          new ConflictException(ALREADY_SIGNED_OUT_USER),
        );
      });
      it('should return 409 status code when user is already exist', async () => {
        const conflictError = async () => {
          await authService.create(createBody);
        };
        await expect(conflictError).rejects.toThrowError(
          new ConflictException(ALREADY_SIGNED_UP_EMAIL),
        );
      });
    });
  });

  describe('login()', () => {
    describe('[Success]', () => {
      it('should login user', async () => {
        authRepository.findOne = jest
          .fn()
          .mockResolvedValue({ ...userData, password: hashPassword('1234') });
        const data = await authService.login(loginBody);
        const { isSeceder, ...rest } = userData;
        expect(data).toEqual({ userData: rest, ...tokenData });
        expect(authRepository.findOne).toHaveBeenCalled();
      });
    });
    describe('[Failure]', () => {
      it('should return 403 status code when password is different', async () => {
        authRepository.findOne = jest
          .fn()
          .mockResolvedValue({ ...userData, password: hashPassword('1235') });
        const forbiddenError = async () => {
          await authService.login(loginBody);
        };
        await expect(forbiddenError).rejects.toThrowError(
          new ForbiddenException(DIFFERENT_PW),
        );
      });
      it('should return 404 status code when user is not exist', async () => {
        authRepository.findOne = jest.fn().mockResolvedValue(null);
        const notFoundError = async () => {
          await authService.login(loginBody);
        };
        await expect(notFoundError).rejects.toThrowError(
          new NotFoundException(NOT_FOUND_USER),
        );
      });
      it('should return 409 status code when user.isSeceder is true', async () => {
        authRepository.findOne = jest
          .fn()
          .mockResolvedValue({ ...userData, isSeceder: true });
        const conflictError = async () => {
          await authService.login(loginBody);
        };
        await expect(conflictError).rejects.toThrowError(
          new ConflictException(ALREADY_SIGNED_OUT_USER),
        );
      });
    });
  });

  describe('signout()', () => {
    describe('[Success]', () => {
      it('should delete a user', async () => {
        await authService.signout(user);
        expect(dataSource.transaction).toHaveBeenCalled();
      });
    });
    describe('[Failure]', () => {
      it('should return 409 status code when user.isSeceder is true', async () => {
        user.isSeceder = true;
        const conflictError = async () => {
          await authService.signout(user);
        };
        await expect(conflictError).rejects.toThrowError(
          new ConflictException(ALREADY_SIGNED_OUT_USER),
        );
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { CreateUserBodyDto, LoginBodyDto } from '../dto/request';
import { RegisterDto, LoginDto } from '../dto/response';

const createBodyDto: CreateUserBodyDto = {
  email: 'test@test.com',
  name: '홍길동',
  password: '1234',
  isAdmin: true,
};

const loginBodyDto: LoginBodyDto = {
  email: 'test@test.com',
  password: '1234',
};

const registerDto: RegisterDto = {
  statusCode: 201,
  message: 'Created',
  data: {
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsImVtYWlsIjoibWluam1hbkB0ZXN0MTIzNS5jb20iLCJpc0FkbWluIjpmYWxzZSwiaXNTZWNlZGVyIjpmYWxzZSwiaWF0IjoxNjU5MTcwMjU1LCJleHAiOjE2NTkxNzc0NTUsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCJ9.Qj-KEbxAoYWaDTg4qBe7koXWI32ekfEGR5_b5Rl0DgA',
  },
};

const loginDto: LoginDto = {
  statusCode: 200,
  message: 'OK',
  data: {
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsImVtYWlsIjoibWluam1hbkB0ZXN0MTIzNS5jb20iLCJpc0FkbWluIjpmYWxzZSwiaXNTZWNlZGVyIjpmYWxzZSwiaWF0IjoxNjU5MTcwMjU1LCJleHAiOjE2NTkxNzc0NTUsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCJ9.Qj-KEbxAoYWaDTg4qBe7koXWI32ekfEGR5_b5Rl0DgA',
    user: {
      id: 1,
      email: 'test@test.com',
      name: '홍길동',
      createdAt: '2022-07-26 22:31:51.914',
      updatedAt: '2022-07-26 22:31:51.914',
    },
  },
};

const userData = {
  id: 1,
  email: 'test@test.com',
  name: '홍길동',
  createdAt: '2022-07-26 22:31:51.914',
  updatedAt: '2022-07-26 22:31:51.914',
};

const tokenData = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsImVtYWlsIjoibWluam1hbkB0ZXN0MTIzNS5jb20iLCJpc0FkbWluIjpmYWxzZSwiaXNTZWNlZGVyIjpmYWxzZSwiaWF0IjoxNjU5MTcwMjU1LCJleHAiOjE2NTkxNzc0NTUsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCJ9.Qj-KEbxAoYWaDTg4qBe7koXWI32ekfEGR5_b5Rl0DgA',
  refreshToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsImVtYWlsIjoibWluam1hbkB0ZXN0MTIzNS5jb20iLCJpc0FkbWluIjpmYWxzZSwiaXNTZWNlZGVyIjpmYWxzZSwiaWF0IjoxNjU5MTcwMjU1LCJleHAiOjE2NTkxNzc0NTUsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCJ9.Qj-KEbxAoYWaDTg4qBe7koXWI32ekfEGR5_b5Rl0DgA',
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  const request: any = {};
  const reply: any = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn().mockResolvedValue(tokenData),
            login: jest.fn().mockResolvedValue({
              userData,
              ...tokenData,
            }),
            signout: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    request.user = {
      id: 1,
      email: 'test@test.com',
      isAdmin: true,
      isSeceder: false,
    };
    reply.setCookie = jest.fn();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register()', () => {
    it('should create a user', () => {
      expect(authController.register(createBodyDto, reply)).resolves.toEqual(
        registerDto.data,
      );
      expect(authService.create).toHaveBeenCalled();
    });
  });

  describe('login()', () => {
    it('should login user', () => {
      expect(authController.login(loginBodyDto, reply)).resolves.toEqual(
        loginDto.data,
      );
      expect(authService.login).toHaveBeenCalled();
    });
  });

  describe('logout()', () => {
    it('should logout user', () => {
      expect(authController.logout(reply)).toBeUndefined();
    });
  });

  describe('signout()', () => {
    it('should delete a user', () => {
      expect(authController.signout(reply, request)).resolves.toBeUndefined();
    });
  });
});

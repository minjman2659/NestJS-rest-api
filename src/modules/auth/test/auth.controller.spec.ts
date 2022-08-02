import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { CreateUserBodyDto, LoginBodyDto } from '../dto/request';

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

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
});

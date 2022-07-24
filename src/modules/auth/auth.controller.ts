import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserBodyDto, LoginBodyDto } from './dto';
import { emailValidator } from '@common/helpers';
import { ValidationPipe } from '@common/pipes';
import { FastifyReply } from 'fastify';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('user')
  async getUserByEmail(
    @Query('email') email: string,
    @Res() reply: FastifyReply,
  ) {
    if (!emailValidator(email)) {
      throw new BadRequestException('올바른 이메일을 입력해주세요.');
    }

    const { message } = await this.authService.findByEmail(email);
    reply.status(200).send(message);
  }

  @Post('register')
  async register(
    @Body(new ValidationPipe()) body: CreateUserBodyDto,
    @Res() reply: FastifyReply,
  ) {
    await this.authService.create(body);
    reply.status(201).send('Created');
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) body: LoginBodyDto) {
    const user = await this.authService.login(body);
    return user;
  }

  @Post('logout')
  logout(@Res() reply: FastifyReply) {
    reply.setCookie('refreshToken', null, {
      maxAge: 0,
      httpOnly: true,
    });
    reply.status(200).send({ accessToken: null });
  }

  @Delete('signout')
  signout(@Res() reply: FastifyReply) {
    // this.authService.signout 실행한 뒤,
    reply.setCookie('refreshToken', null, {
      maxAge: 0,
      httpOnly: true,
    });
    reply.status(200).send({ accessToken: null });
  }
}

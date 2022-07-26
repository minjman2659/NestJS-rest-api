import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserBodyDto, LoginBodyDto } from './dto';
import { emailValidator, mode } from '@common/helpers';
import { AuthGuard } from '@common/guards';
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
  async register(@Body() body: CreateUserBodyDto, @Res() reply: FastifyReply) {
    const { accessToken, refreshToken } = await this.authService.create(body);
    this.setCookie(reply, 'in', refreshToken);
    reply.status(201).send({ accessToken });
  }

  @Post('login')
  async login(@Body() body: LoginBodyDto, @Res() reply: FastifyReply) {
    const { userData, accessToken, refreshToken } =
      await this.authService.login(body);

    this.setCookie(reply, 'in', refreshToken);
    reply.status(201).send({ accessToken, user: userData });
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Res() reply: FastifyReply) {
    this.setCookie(reply, 'out');
    reply.status(200).send({ accessToken: null });
  }

  @Delete('signout')
  signout(@Res() reply: FastifyReply) {
    // this.authService.signout 실행한 뒤,
    this.setCookie(reply, 'out');
    reply.status(200).send({ accessToken: null });
  }

  private setCookie(
    reply: FastifyReply,
    status: 'in' | 'out',
    refreshToken?: string,
  ) {
    if (status === 'in') {
      reply.setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: mode.isProd,
        sameSite: mode.isProd ? 'none' : undefined,
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    } else {
      reply.setCookie('refreshToken', null, {
        maxAge: 0,
        httpOnly: true,
      });
    }
  }
}

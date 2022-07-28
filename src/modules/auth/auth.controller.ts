import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserBodyDto, LoginBodyDto } from './dto';
import { mode } from '@common/helpers';
import { AuthGuard } from '@common/guards';
import { FastifyReply } from 'fastify';
import { FastifyRequestWithUser } from '@common/types/fastify';
import { LOG_OUT_SUCCESS, SIGN_OUT_SUCCESS } from '@common/constants';
import { ResponseMessage } from '@common/decorators';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() body: CreateUserBodyDto, @Res() reply: FastifyReply) {
    const { accessToken, refreshToken } = await this.authService.create(body);
    this.setCookie(reply, 'in', refreshToken);
    return { accessToken };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginBodyDto, @Res() reply: FastifyReply) {
    const { userData, accessToken, refreshToken } =
      await this.authService.login(body);
    this.setCookie(reply, 'in', refreshToken);
    return { accessToken, user: userData };
  }

  @Post('logout')
  @HttpCode(200)
  @ResponseMessage(LOG_OUT_SUCCESS)
  logout(@Res() reply: FastifyReply) {
    this.setCookie(reply, 'out');
    return;
  }

  @UseGuards(AuthGuard)
  @Delete('signout')
  @HttpCode(200)
  @ResponseMessage(SIGN_OUT_SUCCESS)
  async signout(
    @Res() reply: FastifyReply,
    @Req() request: FastifyRequestWithUser,
  ) {
    await this.authService.signout(request.user);
    this.setCookie(reply, 'out');
    return;
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
        sameSite: 'none',
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

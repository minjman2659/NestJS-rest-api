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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { mode } from '@common/helpers';
import { AuthGuard } from '@common/guards';
import { FastifyRequestWithUser } from '@common/types/fastify';
import { LOG_OUT_SUCCESS, SIGN_OUT_SUCCESS } from '@common/constants';
import { ResponseMessage } from '@common/decorators';
import { AuthService } from './auth.service';
import { CreateUserBodyDto, LoginBodyDto } from './dto/request';
import { RegisterDto, LoginDto, LogoutDto, SignoutDto } from './dto/response';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '회원가입 하기',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
    type: RegisterDto,
  })
  @ApiResponse({
    status: 409,
    description: '탈퇴한 유저입니다 || 이미 가입된 이메일 입니다',
  })
  @Post('register')
  @HttpCode(201)
  async register(@Body() body: CreateUserBodyDto, @Res() reply: FastifyReply) {
    const { accessToken, refreshToken } = await this.authService.create(body);
    this.setCookie(reply, 'in', refreshToken);
    return { accessToken };
  }

  @ApiOperation({
    summary: '로그인(로컬) 하기',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: LoginDto,
  })
  @ApiResponse({
    status: 403,
    description: '패스워드가 다릅니다',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 유저 입니다',
  })
  @ApiResponse({
    status: 409,
    description: '탈퇴한 유저입니다',
  })
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginBodyDto, @Res() reply: FastifyReply) {
    const { userData, accessToken, refreshToken } =
      await this.authService.login(body);
    this.setCookie(reply, 'in', refreshToken);
    return { accessToken, user: userData };
  }

  @ApiOperation({
    summary: '로그아웃 하기',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: LogoutDto,
  })
  @Post('logout')
  @HttpCode(200)
  @ResponseMessage(LOG_OUT_SUCCESS)
  logout(@Res() reply: FastifyReply) {
    this.setCookie(reply, 'out');
    return;
  }

  @ApiOperation({
    summary: '회원탈퇴 하기',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: SignoutDto,
  })
  @ApiResponse({
    status: 401,
    description: '로그인 권한이 없습니다',
  })
  @ApiResponse({
    status: 409,
    description: '탈퇴한 유저입니다',
  })
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
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    } else {
      reply.setCookie('refreshToken', null, {
        httpOnly: true,
        secure: mode.isProd,
        sameSite: 'none',
        path: '/',
        maxAge: 0,
      });
    }
  }
}

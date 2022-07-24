import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserBodyDto } from './dto';
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
}

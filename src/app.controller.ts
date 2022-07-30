import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { format } from 'date-fns';
import { FastifyReply } from 'fastify';

@ApiTags('Ping')
@Controller()
export class AppController {
  @Get('ping')
  ping(@Res() reply: FastifyReply) {
    const formattedTime = format(new Date(), 'yy년 MM월 dd일 HH시 mm분 ss초');
    reply.send(formattedTime);
  }
}

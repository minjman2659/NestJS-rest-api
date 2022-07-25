import {
  Controller,
  Get,
  Res,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { UsersService } from './users.service';
import { getUsersQueryDto } from './dto';

// admin 유저만 가능하도록 할 것!
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: getUsersQueryDto, @Res() reply: FastifyReply) {
    const { page, limit } = query;
    const data = await this.usersService.findAll(page, limit);
    reply.status(200).send(data);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() reply: FastifyReply,
  ) {
    const user = await this.usersService.findOne(id);
    reply.status(200).send(user);
  }
}

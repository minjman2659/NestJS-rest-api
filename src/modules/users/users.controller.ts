import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
} from '@nestjs/common';
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
  @HttpCode(200)
  async findAll(@Query() query: getUsersQueryDto) {
    const { page, limit } = query;
    const userList = await this.usersService.findAll(page, limit);
    return userList;
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return user;
  }
}

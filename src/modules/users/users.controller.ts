import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUsersQueryDto } from './dto';
import { AdminGuard, AuthGuard } from '@common/guards';

// admin 유저만 가능하도록 할 것!
@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(AuthGuard, AdminGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  async findAll(@Query() query: GetUsersQueryDto) {
    const { page, limit } = query;
    const userList = await this.usersService.findAll(page, limit);
    return userList;
  }

  @Get(':userId')
  @HttpCode(200)
  async findOne(@Param('userId', ParseIntPipe) userId: number) {
    const { user } = await this.usersService.findOne(userId);
    return { user };
  }
}

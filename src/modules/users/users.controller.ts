import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard, AuthGuard } from '@common/guards';
import { UsersService } from './users.service';
import { GetUsersQueryDto } from './dto/request';
import { FindAllDto, FindOneDto } from './dto/response';

@ApiTags('User')
@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(AuthGuard, AdminGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '유저 리스트 조회하기',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: FindAllDto,
  })
  @ApiResponse({
    status: 401,
    description: '로그인 권한이 없습니다 || 관리자 권한이 없습니다',
  })
  @Get()
  @HttpCode(200)
  async findAll(@Query() query: GetUsersQueryDto) {
    const { page, limit } = query;
    const userList = await this.usersService.findAll(page, limit);
    return userList;
  }

  @ApiOperation({
    summary: '유저 상세 조회하기',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: FindOneDto,
  })
  @ApiResponse({
    status: 401,
    description: '로그인 권한이 없습니다 || 관리자 권한이 없습니다',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 유저 입니다',
  })
  @Get(':userId')
  @HttpCode(200)
  async findOne(@Param('userId', ParseIntPipe) userId: number) {
    const { user } = await this.usersService.findOne(userId);
    return { user };
  }
}

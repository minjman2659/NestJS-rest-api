import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyRequestWithUser } from '@common/types/fastify';
import { ResponseMessage } from '@common/decorators';
import {
  CREATE_POST_SUCCESS,
  DELETE_POST_SUCCESS,
  UPDATE_POST_SUCCESS,
} from '@common/constants';
import { AuthGuard } from '@common/guards';
import { PostsService } from './posts.service';
import { CreateAndUpdatePostBodyDto, GetPostsQueryDto } from './dto/request';
import {
  FindAllDto,
  FindOneDto,
  CreateDto,
  UpdateDto,
  DeleteDto,
} from './dto/response';

@ApiTags('Post')
@Controller({
  path: 'posts',
  version: '1',
})
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: '포스트 리스트 조회하기',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: FindAllDto,
  })
  @Get()
  @HttpCode(200)
  async findAll(@Query() query: GetPostsQueryDto) {
    const { page, limit } = query;
    const postList = await this.postsService.findAll(page, limit);
    return postList;
  }

  @ApiOperation({
    summary: '포스트 상세 조회하기',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: FindOneDto,
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 포스트 입니다',
  })
  @Get(':postId')
  @HttpCode(200)
  async findOne(@Param('postId', ParseIntPipe) postId: number) {
    const { post } = await this.postsService.findOne(postId);
    return { post };
  }

  @ApiOperation({
    summary: '포스트 생성하기',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
    type: CreateDto,
  })
  @ApiResponse({
    status: 401,
    description: '로그인 권한이 없습니다',
  })
  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(201)
  @ResponseMessage(CREATE_POST_SUCCESS)
  async create(
    @Body() body: CreateAndUpdatePostBodyDto,
    @Req() request: FastifyRequestWithUser,
  ) {
    const { id: userId } = request.user;
    await this.postsService.create(body, userId);
    return;
  }

  @ApiOperation({
    summary: '포스트 수정하기',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: UpdateDto,
  })
  @ApiResponse({
    status: 401,
    description: '로그인 권한이 없습니다',
  })
  @ApiResponse({
    status: 403,
    description: '포스트 작성자가 아닙니다',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 포스트 입니다',
  })
  @UseGuards(AuthGuard)
  @Patch(':postId')
  @HttpCode(200)
  @ResponseMessage(UPDATE_POST_SUCCESS)
  async update(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: CreateAndUpdatePostBodyDto,
    @Req() request: FastifyRequestWithUser,
  ) {
    const { id: userId } = request.user;
    await this.postsService.update(postId, body, userId);
    return;
  }

  @ApiOperation({
    summary: '포스트 삭제하기',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: DeleteDto,
  })
  @ApiResponse({
    status: 401,
    description: '로그인 권한이 없습니다',
  })
  @ApiResponse({
    status: 403,
    description: '포스트 작성자가 아닙니다',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 포스트 입니다',
  })
  @UseGuards(AuthGuard)
  @Delete(':postId')
  @HttpCode(200)
  @ResponseMessage(DELETE_POST_SUCCESS)
  async delete(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() request: FastifyRequestWithUser,
  ) {
    const { id: userId } = request.user;
    await this.postsService.delete(postId, userId);
    return;
  }
}

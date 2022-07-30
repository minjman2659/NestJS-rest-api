import { CreateAndUpdatePostBodyDto, GetPostsQueryDto } from './dto';
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
import { PostsService } from './posts.service';
import { FastifyRequestWithUser } from '@common/types/fastify';
import { ResponseMessage } from '@common/decorators';
import {
  CREATE_POST_SUCCESS,
  DELETE_POST_SUCCESS,
  UPDATE_POST_SUCCESS,
} from '@common/constants';
import { AuthGuard } from '@common/guards';

@Controller({
  path: 'posts',
  version: '1',
})
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @HttpCode(200)
  async findAll(@Query() query: GetPostsQueryDto) {
    const { page, limit } = query;
    const postList = await this.postsService.findAll(page, limit);
    return postList;
  }

  @Get(':postId')
  @HttpCode(200)
  async findOne(@Param('postId', ParseIntPipe) postId: number) {
    const { post } = await this.postsService.findOne(postId);
    return { post };
  }

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

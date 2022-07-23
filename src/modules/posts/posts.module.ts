import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostEntity } from './post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

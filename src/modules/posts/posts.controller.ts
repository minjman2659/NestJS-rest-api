import { Controller } from '@nestjs/common';

@Controller({
  path: 'posts',
  version: '1',
})
export class PostsController {}

import { ApiProperty, PickType } from '@nestjs/swagger';
import { FindAllPostsDto } from './find-all-posts.dto';

export class FindOnePostDto extends PickType(FindAllPostsDto, [
  'statusCode',
  'message',
]) {
  @ApiProperty({
    example: {
      post: {
        id: 1,
        userId: 1,
        title: '포스트 제목',
        content: '포스트 내용',
        thumbnail: '포스트 썸네일',
        isTemp: false,
        createdAt: '2022-07-30T14:33:49.807Z',
        updatedAt: '2022-07-30T14:33:49.807Z',
        user: {
          name: '홍길동',
          email: 'test@test.com',
        },
      },
    },
    description: '응답 데이터',
    required: true,
  })
  data: object;
}

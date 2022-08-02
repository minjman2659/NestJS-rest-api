import { ApiProperty } from '@nestjs/swagger';

export class FindAllPostsDto {
  @ApiProperty({
    example: 200,
    description: 'Http 상태 코드',
    required: true,
  })
  statusCode: number;

  @ApiProperty({
    example: 'OK',
    description: '메시지',
    required: true,
  })
  message: string;

  @ApiProperty({
    example: {
      posts: [
        {
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
      ],
      count: 10,
    },
    description: '응답 데이터',
    required: true,
  })
  data: object;
}

import { ApiProperty, PickType } from '@nestjs/swagger';
import { FindAllUsersDto } from './find-all-users.dto';

export class FindOneUserDto extends PickType(FindAllUsersDto, [
  'statusCode',
  'message',
]) {
  @ApiProperty({
    example: {
      user: {
        id: 1,
        name: '홍길동',
        email: 'test@test.com',
        isAdmin: true,
        isSeceder: false,
        createdAt: '2022-07-25T15:42:08.203Z',
        updatedAt: '2022-07-25T15:42:08.203Z',
        posts: [
          {
            id: 1,
            title: '포스트 제목',
            content: '포스트 내용',
            thumbnail: '포스트 썸네일',
            isTemp: false,
          },
        ],
      },
    },
    description: '응답 데이터',
    required: true,
  })
  data: object;
}

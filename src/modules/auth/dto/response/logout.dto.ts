import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({
    example: 200,
    description: 'Http 상태 코드',
    required: true,
  })
  statusCode: number;

  @ApiProperty({
    example: '로그아웃이 성공적으로 이루어졌습니다',
    description: '메시지',
    required: true,
  })
  message: string;

  @ApiProperty({
    example: {
      accessToken: null,
    },
    description: '응답 데이터',
    required: true,
  })
  data: object;
}

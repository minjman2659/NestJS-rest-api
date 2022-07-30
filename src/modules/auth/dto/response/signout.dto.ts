import { ApiProperty } from '@nestjs/swagger';

export class SignoutDto {
  @ApiProperty({
    example: 200,
    description: 'Http 상태 코드',
    required: true,
  })
  statusCode: number;

  @ApiProperty({
    example: '회원탈퇴가 성공적으로 이루어졌습니다',
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

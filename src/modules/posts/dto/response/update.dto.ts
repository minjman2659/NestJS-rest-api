import { ApiProperty } from '@nestjs/swagger';

export class UpdateDto {
  @ApiProperty({
    example: 200,
    description: 'Http 상태 코드',
    required: true,
  })
  statusCode: number;

  @ApiProperty({
    example: '포스트 수정이 성공적으로 이루어졌습니다',
    description: '메시지',
    required: true,
  })
  message: string;
}

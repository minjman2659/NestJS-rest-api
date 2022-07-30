import { ApiProperty } from '@nestjs/swagger';

export class CreateDto {
  @ApiProperty({
    example: 201,
    description: 'Http 상태 코드',
    required: true,
  })
  statusCode: number;

  @ApiProperty({
    example: '포스트 등록이 성공적으로 이루어졌습니다',
    description: '메시지',
    required: true,
  })
  message: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
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
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsImVtYWlsIjoibWluam1hbkB0ZXN0MTIzNS5jb20iLCJpc0FkbWluIjpmYWxzZSwiaXNTZWNlZGVyIjpmYWxzZSwiaWF0IjoxNjU5MTcwMjU1LCJleHAiOjE2NTkxNzc0NTUsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCJ9.Qj-KEbxAoYWaDTg4qBe7koXWI32ekfEGR5_b5Rl0DgA',
      user: {
        id: 1,
        email: 'test@test.com',
        name: '홍길동',
        createdAt: '2022-07-26 22:31:51.914',
        updatedAt: '2022-07-26 22:31:51.914',
      },
    },
    description: '응답 데이터',
    required: true,
  })
  data: object;
}

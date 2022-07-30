import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateAndUpdatePostBodyDto {
  @ApiProperty({
    example: '제목',
    description: '포스트 제목',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '콘텐츠',
    description: '포스트 내용',
    required: false,
  })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({
    example: 'post.png',
    description: '포스트 썸네일',
    required: false,
  })
  @IsString()
  @IsOptional()
  thumbnail: string;

  @ApiProperty({
    example: false,
    description: '임시저장 상태 여부',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isTemp: boolean;
}

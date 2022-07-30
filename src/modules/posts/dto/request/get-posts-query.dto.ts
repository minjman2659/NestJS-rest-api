import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class GetPostsQueryDto {
  @ApiProperty({
    example: 1,
    description: '조회하고자 하는 페이지',
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  page: number;

  @ApiProperty({
    example: 10,
    description: '조회하고자 하는 개수',
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  limit: number;
}

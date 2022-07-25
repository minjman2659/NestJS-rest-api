import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class getUsersQueryDto {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  page: number;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  limit: number;
}

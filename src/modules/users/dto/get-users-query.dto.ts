import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class GetUsersQueryDto {
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

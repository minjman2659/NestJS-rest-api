import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateAndUpdatePostBodyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsBoolean()
  @IsNotEmpty()
  isTemp: boolean;
}

import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class CreateUserBodyDto {
  @IsString()
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;
}

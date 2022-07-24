import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginBodyDto {
  @IsString()
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

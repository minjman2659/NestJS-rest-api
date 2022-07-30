import { ApiProperty, PickType } from '@nestjs/swagger';
import { LogoutDto } from './logout.dto';

export class SignoutDto extends PickType(LogoutDto, ['statusCode']) {
  @ApiProperty({
    example: '회원탈퇴가 성공적으로 이루어졌습니다',
    description: '메시지',
    required: true,
  })
  message: string;

  @ApiProperty({
    example: {
      accessToken: null,
    },
    description: '응답 데이터',
    required: true,
  })
  data: object;
}

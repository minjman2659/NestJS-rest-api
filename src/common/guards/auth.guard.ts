import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequestWithUser } from '@common/types/fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request: FastifyRequestWithUser = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(2);
    console.log('user : ', user);
    if (!user) {
      throw new UnauthorizedException('로그인 권한이 없습니다.');
    }
    return true;
  }
}

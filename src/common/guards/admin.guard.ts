import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequestWithUser } from '@common/types/fastify';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: FastifyRequestWithUser = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.isAdmin) {
      throw new UnauthorizedException('관리자 권한이 없습니다.');
    }
    return true;
  }
}

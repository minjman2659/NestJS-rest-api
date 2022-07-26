import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '@providers/token';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const isAuthorized = await this.tokenService.authorizeToken(req);
    if (!isAuthorized) {
      throw new UnauthorizedException('로그인 권한이 없습니다.');
    }
    return isAuthorized;
  }
}

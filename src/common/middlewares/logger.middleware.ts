import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from 'src/providers/logger';

// req.user 관련 진행할 미들웨어
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const loggerService = new LoggerService();
    const log = {
      url: req.originalUrl,
      method: req.method,
      params: req.params,
      query: req.query,
      body: req.body,
    };

    loggerService.log(JSON.stringify(log));
    next();
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from 'src/providers/logger';

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
    // response가 완료된 이후에 로그를 남기고자 하는 경우
    res.on('finish', () => {
      loggerService.log(JSON.stringify(log));
    });

    next();
  }
}

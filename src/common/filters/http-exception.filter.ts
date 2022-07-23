import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from 'src/providers/logger';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let log = '';
    if (exception instanceof HttpException) {
      const statusCode =
        (exception.getResponse() as any).statusCode ||
        (exception.getResponse() as any).status ||
        500;

      log = `
        method: ${request.method}
        url: ${request.url}
        statusCode: ${statusCode}
        message: ${exception.message}
        query: ${JSON.stringify(request.query || {})}
        body: ${JSON.stringify(request.body || {})}
      `;

      if (statusCode === 400) {
        log += `reason: ${(exception.getResponse() as any)?.message}`;
      }

      log += `stack: ${exception.stack.slice(0, 100)}`;

      this.logger.log(log);
      return reply.status(exception.getStatus()).send(exception.getResponse());
    } else {
      console.log('Not HttpException error', exception);
      this.logger.error(exception);
    }

    const prodLog = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message:
        ((exception as any)?.getResponse() as any)?.message ||
        'Internal Server Error',
    };

    reply.status(prodLog.statusCode).send(prodLog);
  }
}

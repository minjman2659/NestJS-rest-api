import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { FastifyReply } from 'fastify';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const reply = context.switchToHttp().getResponse<FastifyReply<any>>();
        reply.status(context.switchToHttp().getResponse().statusCode).send({
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: data.message
            ? data.message
            : context.switchToHttp().getResponse().statusCode === 201
            ? 'Created'
            : 'OK',
          data: data.message ? null : data,
        });
      }),
    );
  }
}

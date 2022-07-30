import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { FastifyReply } from 'fastify';
import { TokenService } from '@providers/token';
import { FastifyRequestWithUser } from '@common/types/fastify';
import { ResponseMessageKey } from '@common/decorators';
import { LOG_OUT_SUCCESS, SIGN_OUT_SUCCESS } from '@common/constants';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(
    private readonly tokenService: TokenService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const responseMessage =
      this.reflector.get<string>(ResponseMessageKey, context.getHandler()) ??
      '';
    return next.handle().pipe(
      map(async (data) => {
        const request = context
          .switchToHttp()
          .getRequest<FastifyRequestWithUser>();
        const { newAccessToken } = await this.tokenService.reissueAccessToken(
          request,
        );
        if (newAccessToken) {
          console.log('new : ', newAccessToken);
          data.accessToken = newAccessToken;
        }

        const reply = context.switchToHttp().getResponse<FastifyReply<any>>();
        reply.status(context.switchToHttp().getResponse().statusCode).send({
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: responseMessage
            ? responseMessage
            : context.switchToHttp().getResponse().statusCode === 201
            ? 'Created'
            : 'OK',
          data:
            responseMessage &&
            [LOG_OUT_SUCCESS, SIGN_OUT_SUCCESS].includes(responseMessage)
              ? { accessToken: null }
              : data,
        });
      }),
    );
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyInstance } from 'fastify';
import { TokenService } from '@providers/token';
import { FastifyRequestWithUser } from '@common/types/fastify';
import { TokenPayload } from '@providers/token/types';

@Injectable()
export class CoreService implements OnModuleInit {
  constructor(
    private adapterHost: HttpAdapterHost,
    private tokenService: TokenService,
  ) {}

  onModuleInit() {
    const fastify: FastifyInstance = this.adapterHost.httpAdapter.getInstance();
    fastify.decorateRequest('user', null);

    try {
      fastify.addHook('preHandler', async (request: FastifyRequestWithUser) => {
        const accessToken = request.headers.authorization
          ? request.headers.authorization.split('Bearer ')[1]
          : null;
        const refreshToken = request.cookies['refreshToken'] || null;

        if (accessToken) {
          const accessData: TokenPayload = await this.tokenService.verifyJwt(
            accessToken,
          );
          request.user = accessData;
        } else if (refreshToken) {
          const refreshData: TokenPayload = await this.tokenService.verifyJwt(
            refreshToken,
          );
          request.user = refreshData;
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
}
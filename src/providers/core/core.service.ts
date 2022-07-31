import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyInstance } from 'fastify';
import { TokenService } from '@providers/token';
import { FastifyRequestWithUser } from '@common/types/fastify';

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
        console.log(1);
        console.log('cookies : ', request.cookies);
        await this.tokenService.authorizeToken(request);
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}

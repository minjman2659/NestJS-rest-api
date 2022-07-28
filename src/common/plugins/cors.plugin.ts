import { mode } from '@common/helpers';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const callback: FastifyPluginCallback = (fastify, options, done) => {
  fastify.addHook('onRequest', (request, reply, done) => {
    const origin = request.headers.origin || request.headers.host;

    const allowed = mode.isDev || process.env.CLIENT_HOST;
    if (allowed) {
      reply.header('Access-Control-Allow-Origin', origin);
    }

    reply.header(
      'Access-Control-Allow-Methods',
      'POST, PUT, GET, DELETE, PATCH, OPTIONS',
    );
    reply.header(
      'Access-Control-Allow-Headers',
      'Content-Type, X-Requested-With',
    );
    reply.header('Access-Control-Allow-Credentials', true);

    if (request.method === 'OPTIONS') {
      reply.status(204).send('Ok');
    } else {
      done();
    }
  });
  done();
};

export const CorsPlugin = fp(callback, { name: 'CorsPlugin' });

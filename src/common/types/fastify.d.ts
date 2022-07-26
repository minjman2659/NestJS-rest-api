import { FastifyRequest } from 'fastify';

type User = {
  id: number;
  email: string;
  isAdmin: boolean;
};

declare interface FastifyRequestWithUser extends FastifyRequest {
  user?: User;
}

// declare module 'fastify' {
//   interface FastifyRequest {
//     user?: User;
//   }
// }

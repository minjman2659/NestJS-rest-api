import { FastifyRequest } from 'fastify';

export type User = {
  id: number;
  email: string;
  isAdmin: boolean;
  isSeceder: boolean;
};

declare interface FastifyRequestWithUser extends FastifyRequest {
  user?: User;
}

// declare module 'fastify' {
//   interface FastifyRequest {
//     user?: User;
//   }
// }

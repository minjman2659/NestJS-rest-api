import { User } from './fastify';

export interface TokenPayload extends User {
  iat?: number;
  exp?: number;
  iss?: string;
}

import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { FastifyRequest } from 'fastify';
import { TokenPayload } from './types';

@Injectable()
export class TokenService {
  async generateAccessToken(payload: TokenPayload) {
    const accessToken = await this.generateToken(payload, '2h');
    return { accessToken };
  }

  async generateRefreshToken(payload: TokenPayload) {
    const refreshToken = await this.generateToken(payload, '30d');
    return { refreshToken };
  }

  private generateToken(
    payload: TokenPayload,
    expiresIn: string | number,
  ): Promise<string> {
    const apiHost = process.env.API_HOST;
    const jwtSecret = process.env.SECRET_KEY;

    const jwtOptions: jwt.SignOptions = {
      issuer: apiHost,
      expiresIn,
    };

    return new Promise((resolve, reject) => {
      jwt.sign(payload, jwtSecret, jwtOptions, (err, token) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(token);
      });
    });
  }

  async authorizeToken(req: FastifyRequest) {
    if (!req.headers.authorization) {
      return false;
    }
    const accessToken = req.headers.authorization.split('Bearer ')[1];
    const refreshToken = req.cookies['refreshToken'];

    try {
      if (!accessToken) {
        throw new Error('No Access Token');
      }
      const accessData: TokenPayload = await this.verifyJwt(accessToken);

      return !!accessData;
    } catch (err) {
      if (!refreshToken) {
        return false;
      }
      try {
        const refreshData: TokenPayload = await this.verifyJwt(refreshToken);

        return !!refreshData;
      } catch (err) {
        console.log(err);
        return false;
      }
    }
  }

  verifyJwt(token: string): Promise<TokenPayload> {
    const jwtSecret = process.env.SECRET_KEY;

    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, (err, decoded: TokenPayload) => {
        if (err) {
          reject(err);
        }
        if (!decoded) {
          throw new Error('Decoded JWT is undefined');
        }
        resolve(decoded);
      });
    });
  }
}

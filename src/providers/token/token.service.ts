import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { FastifyRequestWithUser } from '@common/types/fastify';
import { TokenPayload } from '@common/types/token';

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

  async authorizeToken(req: FastifyRequestWithUser) {
    if (!req.headers.authorization) {
      return false;
    }
    const accessToken = req.headers.authorization.split('Bearer ')[1];
    const refreshToken = req.cookies['refreshToken'];
    try {
      //* accessToken이 없을 경우, refreshToken 검증을 위해 아래 catch문으로 이동
      if (!accessToken) {
        throw new Error('No Access Token');
      }
      const accessData: TokenPayload = await this.verifyJwt(accessToken);
      //* accessData가 없을 경우, refreshToken 검증을 위해 아래 catch문으로 이동
      if (!accessData) {
        throw new Error('Access Token Error: None or Token_Expired');
      }
      //* accessData가 존재할 경우, 바로 true 리턴
      return true;
    } catch (err) {
      //* refreshToken이 없을 경우, 바로 false 리턴
      if (!refreshToken) {
        return false;
      }
      try {
        const refreshData: TokenPayload = await this.verifyJwt(refreshToken);
        return !!refreshData;
      } catch (err) {
        throw new Error(err);
      }
    }
  }

  verifyJwt(token: string): Promise<TokenPayload> {
    const jwtSecret = process.env.SECRET_KEY;
    //* accessToken과 refreshToken 모두 검증하는 메소드
    //* accessToken의 경우, 없거나 만료되더라도 refreshToken 검증도 진행해야 하므로,
    //* 바로 에러를 발생시키는 것이 아니라, null을 리턴한다!
    return new Promise((resolve) => {
      jwt.verify(token, jwtSecret, (err, decoded: TokenPayload) => {
        if (err) {
          // console.error(err);
          resolve(null);
        }
        resolve(decoded);
      });
    });
  }
}

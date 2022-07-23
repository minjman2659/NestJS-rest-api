import * as fs from 'fs';
import * as path from 'path';

import { Injectable, LoggerService as LS } from '@nestjs/common';
import * as winston from 'winston';
import { format } from 'date-fns';

@Injectable()
export class LoggerService implements LS {
  private logger: winston.Logger;
  private logDir: string;

  constructor() {
    const { combine, timestamp, printf, colorize, errors } = winston.format;

    const logDir = path.resolve(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    this.logDir = logDir;

    const isDevelopment = process.env.NODE_ENV === 'development';

    const levels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      debug: 4,
    };

    const level = () => {
      return isDevelopment ? 'debug' : 'http';
    };

    // Log Format
    const logFormat = combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      printf((info) => {
        const message = `[${info.level.toUpperCase()}] ${info.timestamp}: ${
          info.message
        }`;

        if (info.stack) {
          message +
            `Error Stack: ${info.stack}
          `;
        }

        return message;
      }),
    );

    const consoleOpts = {
      handleExceptions: true,
      level: isDevelopment ? 'debug' : 'error',
      format: combine(colorize(), errors({ stack: true })),
    };

    const transports = [
      // 콘솔로그찍을 때만 색넣기
      new winston.transports.Console(consoleOpts),
      // error 레벨 로그를 저장할 파일 설정
      new winston.transports.File({
        level: 'error',
        dirname: path.join(logDir, '/error'),
        filename: `${format(new Date(), 'yyyy-MM-dd')}.log`,
        maxFiles: 30,
        zippedArchive: true,
      }),
      // 모든 레벨 로그를 저장할 파일 설정
      new winston.transports.File({
        level: 'debug',
        dirname: path.join(logDir, '/all'),
        filename: `${format(new Date(), 'yyyy-MM-dd')}.log`,
        maxFiles: 30,
        zippedArchive: true,
      }),
    ];

    this.logger = winston.createLogger({
      level: level(),
      levels,
      format: logFormat,
      transports,
    });
  }
  write(text: string) {
    try {
      const dir = this.logDir;
      const now = format(new Date(), 'yyyy-MM-dd');
      const filePath = `${dir}/error/${now}.log`;
      fs.appendFileSync(filePath, `${text}\n`, 'utf8');
    } catch (error) {
      this.rawError(JSON.stringify(error, null, 4));
    }
  }
  log(message: string) {
    this.logger.info(message);
  }
  error(error: any) {
    this.logger.error('');
    Object.keys(error).map((key) => {
      if (typeof error[key] === 'object') {
        const line = `[${[key]}]: ${JSON.stringify(error[key])}`;
        console.log(line);
        this.write(line);
      } else {
        const line = `[${[key]}]: ${error[key]}`;
        console.log(line);
        this.write(line);
      }
    });
  }
  rawError(error: any) {
    this.logger.error(error);
  }
  warn(message: string) {
    this.logger.warn(message);
  }
  debug(message: string) {
    this.logger.debug(message);
  }
}

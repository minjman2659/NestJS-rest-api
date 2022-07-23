import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggerService } from './providers/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(new LoggerService()));
  const configService = app.get(ConfigService);

  await app.listen(configService.get('PORT'), (err, address) => {
    console.log(`Server is Running: ${address}`);
    console.log(`Server ENV: ${configService.get('NODE_ENV')}`);
  });
}
bootstrap();

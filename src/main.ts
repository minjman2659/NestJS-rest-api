import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import fastifyCookie from '@fastify/cookie';
import { ValidationPipe } from '@common/pipes';
import { HttpExceptionFilter } from '@common/filters';
import { AppModule } from './app.module';
import { LoggerService } from '@providers/logger';

async function bootstrap() {
  const logger = new LoggerService();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  const configService = app.get(ConfigService);

  app.enableCors({
    origin:
      configService.get('NODE_ENV') === 'development'
        ? true
        : configService.get('CLIENT_HOST'),
    credentials: true,
  });
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');

  await app.register(fastifyCookie, {
    secret: configService.get('SECRET_KEY'),
  });

  await app.listen(configService.get('PORT'), (err, address) => {
    if (err) {
      logger.error(err);
    }
    console.log(`Server is Running: ${address}`);
    console.log(`Server ENV: ${configService.get('NODE_ENV')}`);
    console.log(
      `Database Connection: ${configService.get('POSTGRES_HOST')} DB`,
    );
  });
}
bootstrap();

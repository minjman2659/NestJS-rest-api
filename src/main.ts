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
  app.setGlobalPrefix('/api');

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

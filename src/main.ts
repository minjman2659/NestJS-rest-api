import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import fastifyCookie from '@fastify/cookie';
import { ValidationPipe } from '@common/pipes';
import { LoggerService } from '@providers/logger';
import { AppModule } from './app.module';

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
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');

  await app.register(fastifyCookie, {
    secret: configService.get('SECRET_KEY'),
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS_REST_API')
    .setDescription('NestJS_REST_API sample')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  await app.listen(configService.get('PORT'), '0.0.0.0', (err, address) => {
    if (err) {
      logger.error(err);
    }
    console.log(`Server is Running: ${address}`);
    console.log(`Server ENV: ${configService.get('NODE_ENV')}`);
    console.log(
      `Database Connection: ${configService.get('POSTGRES_HOST')} DB`,
    );
    if (configService.get('NODE_ENV') === 'development') {
      console.log(
        `Swagger Docs Url: ${configService.get('API_HOST')}/api/docs`,
      );
    }
  });
}
bootstrap();

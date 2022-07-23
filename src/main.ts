import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  console.log(__dirname);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const env = configService.get('NODE_ENV');

  await app.listen(port, (err, address) => {
    console.log(`Server is Running: ${address}`);
    console.log(`Server ENV: ${env}`);
  });
}
bootstrap();

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { configuration, validationSchema } from './config';
import { UsersModule } from './modules/users/users.module';
import { LoggerModule } from './providers/logger';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters';
import { PostsModule } from './modules/posts/posts.module';

const typeOrmModuleOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: 5432,
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PW'),
    database: configService.get('POSTGRES_DATABASE'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    synchronize: configService.get('NODE_ENV') === 'production' ? false : true,
    // logging: configService.get('NODE_ENV') === 'production' ? false : true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
      load: [configuration],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    UsersModule,
    LoggerModule,
    PostsModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { configuration, validationSchema } from './config';
import { HealthCheckModule } from '@modules/health-check/health-check.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { PostsModule } from '@modules/posts/posts.module';
import { CoreModule } from '@providers/core/core.module';
import { TokenModule } from '@providers/token/token.module';
import { LoggerModule } from '@providers/logger';
import { mode } from '@common/helpers';
import { HttpExceptionFilter } from '@common/filters';
import { ResponseInterceptor, TimeoutInterceptor } from '@common/interceptors';
import { AppController } from './app.controller';

const typeOrmModuleOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
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
    synchronize: mode.isProd ? false : true,
    // logging: mode.isProd ? false : true,
  }),
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: mode.isProd ? '.env.prod' : '.env.dev',
      load: [configuration],
      validationSchema,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    CoreModule,
    UsersModule,
    LoggerModule,
    PostsModule,
    AuthModule,
    TokenModule,
    HealthCheckModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

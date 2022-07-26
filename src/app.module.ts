import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { configuration, validationSchema } from './config';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { PostsModule } from '@modules/posts/posts.module';
import { TokenModule } from '@providers/token/token.module';
import { LoggerModule } from '@providers/logger';
import { mode } from '@common/helpers';
import { AppController } from './app.controller';
import { CoreModule } from '@providers/core/core.module';

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
    synchronize: mode.isProd ? false : true,
    // logging: mode.isProd ? false : true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: mode.isProd ? '.env.prod' : '.env.dev',
      load: [configuration],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    UsersModule,
    LoggerModule,
    PostsModule,
    AuthModule,
    TokenModule,
    CoreModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

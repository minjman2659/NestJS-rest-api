import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from '@modules/users/user.entity';
import { TokenModule } from '@providers/token';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

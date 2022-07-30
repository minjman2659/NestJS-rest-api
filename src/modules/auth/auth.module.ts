import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserEntity } from '@modules/users/user.entity';
import { TokenModule } from '@providers/token';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { TokenModule } from '@providers/token';
import { CoreService } from './core.service';

@Module({
  imports: [TokenModule],
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule {}

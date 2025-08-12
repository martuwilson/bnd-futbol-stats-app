import { Module } from '@nestjs/common';
import { CallUpsService } from './call-ups.service';
import { CallUpsResolver } from './call-ups.resolver';

@Module({
  providers: [CallUpsService, CallUpsResolver],
  exports: [CallUpsService],
})
export class CallUpsModule {}

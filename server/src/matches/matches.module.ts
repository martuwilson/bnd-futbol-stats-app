import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesResolver } from './matches.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [MatchesService, MatchesResolver],
  exports: [MatchesService],
})
export class MatchesModule {}

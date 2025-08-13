import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { MatchesModule } from './matches/matches.module'; // Reactivado
import { CallUpsModule } from './call-ups/call-ups.module';
import { StatisticsModule } from './statistics/statistics.module'; // Reactivado
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: process.env.ENABLE_PLAYGROUND === 'true',
      introspection: process.env.ENABLE_INTROSPECTION === 'true',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MatchesModule, // Reactivado
    CallUpsModule, 
    StatisticsModule, // Reactivado
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

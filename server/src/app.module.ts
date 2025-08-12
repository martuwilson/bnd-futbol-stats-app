import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
// import { MatchesModule } from './matches/matches.module'; // Temporalmente deshabilitado
import { CallUpsModule } from './call-ups/call-ups.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),
    PrismaModule,
    UsersModule,
    // MatchesModule, // Temporalmente deshabilitado
    CallUpsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

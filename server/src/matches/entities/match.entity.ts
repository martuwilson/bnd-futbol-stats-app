import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Match {
  @Field(() => ID)
  id: string;

  @Field()
  date: Date;

  @Field()
  team1Name: string;

  @Field()
  team2Name: string;

  @Field(() => Int)
  team1Goals: number;

  @Field(() => Int)
  team2Goals: number;

  @Field()
  isFinished: boolean;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class MatchPlayer {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  team: number;

  @Field()
  playerId: string;

  @Field()
  matchId: string;
}

@ObjectType()
export class PlayerStats {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  goals: number;

  @Field(() => Int)
  assists: number;

  @Field(() => Int)
  yellowCards: number;

  @Field(() => Int)
  redCards: number;

  @Field()
  playerId: string;

  @Field()
  matchId: string;
}

import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class PlayerStatistics {
  @Field(() => User)
  user: User;

  @Field(() => Int)
  totalMatches: number;

  @Field(() => Int)
  totalGoals: number;

  @Field(() => Int)
  totalAssists: number;

  @Field(() => Int)
  totalYellowCards: number;

  @Field(() => Int)
  totalRedCards: number;

  @Field(() => Float)
  goalsPerMatch: number;

  @Field(() => Float)
  assistsPerMatch: number;

  @Field(() => Float)
  effectivenessRating: number; // Rating basado en contribución al equipo
}

@ObjectType()
export class MatchStatistics {
  @Field(() => String)
  matchId: string;

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

  @Field(() => Int)
  totalGoals: number;

  @Field(() => Int)
  totalAssists: number;

  @Field(() => Int)
  totalCards: number;

  @Field(() => User, { nullable: true })
  mvp?: User; // Most Valuable Player del partido
}

@ObjectType()
export class SeasonStatistics {
  @Field(() => Int)
  totalMatches: number;

  @Field(() => Int)
  totalGoals: number;

  @Field(() => Int)
  totalAssists: number;

  @Field(() => Float)
  averageGoalsPerMatch: number;

  @Field(() => Float)
  averageAssistsPerMatch: number;

  @Field(() => [PlayerStatistics])
  topScorers: PlayerStatistics[];

  @Field(() => [PlayerStatistics])
  topAssists: PlayerStatistics[];

  @Field(() => [PlayerStatistics])
  mostEffective: PlayerStatistics[];
}

@ObjectType()
export class PositionStatistics {
  @Field()
  position: string;

  @Field(() => Int)
  playerCount: number;

  @Field(() => Float)
  averageGoals: number;

  @Field(() => Float)
  averageAssists: number;

  @Field(() => [PlayerStatistics])
  topPerformers: PlayerStatistics[];
}

@ObjectType()
export class ComparisonStatistics {
  @Field(() => User)
  user1: User;

  @Field(() => User)
  user2: User;

  @Field(() => PlayerStatistics)
  user1Stats: PlayerStatistics;

  @Field(() => PlayerStatistics)
  user2Stats: PlayerStatistics;

  @Field()
  winner: string; // "user1", "user2", or "tie"

  @Field(() => Float)
  scoreDifference: number;
}

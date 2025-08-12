import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, Min, Max, IsArray } from 'class-validator';

@InputType()
export class StatisticsFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  startDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  endDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  position?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  userIds?: string[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}

@InputType()
export class PlayerComparisonInput {
  @Field()
  @IsString()
  userId1: string;

  @Field()
  @IsString()
  userId2: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  startDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  endDate?: string;
}

@InputType()
export class MatchAnalysisInput {
  @Field()
  @IsString()
  matchId: string;
}

@InputType()
export class RankingInput {
  @Field()
  @IsString()
  category: string; // "goals", "assists", "effectiveness", "matches"

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  position?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  startDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  endDate?: string;
}

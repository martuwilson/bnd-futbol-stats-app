import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsInt, Min, IsDateString, IsArray } from 'class-validator';

@InputType()
export class CreateMatchInput {
  @Field()
  @IsDateString()
  date: string;

  @Field({ nullable: true })
  @IsOptional()
  team1Name?: string;

  @Field({ nullable: true })
  @IsOptional()
  team2Name?: string;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;

  @Field()
  @IsNotEmpty()
  userId: string;
}

@InputType()
export class UpdateMatchInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  date?: string;

  @Field({ nullable: true })
  @IsOptional()
  team1Name?: string;

  @Field({ nullable: true })
  @IsOptional()
  team2Name?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  team1Goals?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  team2Goals?: number;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;

  @Field({ nullable: true })
  @IsOptional()
  isFinished?: boolean;
}

@InputType()
export class AddPlayerToMatchInput {
  @Field()
  @IsNotEmpty()
  playerId: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  team: number; // 1 o 2
}

@InputType()
export class UpdatePlayerStatsInput {
  @Field()
  @IsNotEmpty()
  playerId: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  goals?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  assists?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  yellowCards?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  redCards?: number;
}

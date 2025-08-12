import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsDateString, IsInt, Min } from 'class-validator';

@InputType()
export class CreateCallUpInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field()
  @IsDateString()
  matchDate: string;

  @Field({ nullable: true })
  @IsOptional()
  location?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxPlayers?: number;

  @Field()
  @IsNotEmpty()
  createdById: string;
}

@InputType()
export class UpdateCallUpInput {
  @Field({ nullable: true })
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  matchDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  location?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxPlayers?: number;

  @Field({ nullable: true })
  @IsOptional()
  isOpen?: boolean;
}

@InputType()
export class JoinCallUpInput {
  @Field()
  @IsNotEmpty()
  callUpId: string;

  @Field()
  @IsNotEmpty()
  userId: string;

  @Field({ nullable: true })
  @IsOptional()
  message?: string;
}

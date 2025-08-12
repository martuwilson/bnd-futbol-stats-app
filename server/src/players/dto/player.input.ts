import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreatePlayerInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  nickname?: string;

  @Field({ nullable: true })
  @IsOptional()
  position?: string;

  @Field()
  @IsNotEmpty()
  userId: string;
}

@InputType()
export class UpdatePlayerInput {
  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  nickname?: string;

  @Field({ nullable: true })
  @IsOptional()
  position?: string;
}

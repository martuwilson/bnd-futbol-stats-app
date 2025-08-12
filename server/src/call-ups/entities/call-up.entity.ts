import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class CallUp {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  matchDate: Date;

  @Field({ nullable: true })
  location?: string;

  @Field(() => Int, { nullable: true })
  maxPlayers?: number;

  @Field()
  isOpen: boolean;

  @Field()
  createdById: string;

  @Field(() => User)
  createdBy: User;

  @Field(() => [CallUpResponse])
  responses: CallUpResponse[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class CallUpResponse {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  position: number;

  @Field({ nullable: true })
  message?: string;

  @Field()
  callUpId: string;

  @Field(() => CallUp)
  callUp: CallUp;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field()
  createdAt: Date;
}

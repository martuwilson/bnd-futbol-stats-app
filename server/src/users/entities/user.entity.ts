import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER', 
  VIEWER = 'VIEWER'
}

export enum Position {
  GOALKEEPER = 'GOALKEEPER',
  DEFENDER = 'DEFENDER',
  MIDFIELDER = 'MIDFIELDER',
  FORWARD = 'FORWARD'
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Los roles disponibles para los usuarios'
});

registerEnumType(Position, {
  name: 'Position',
  description: 'Las posiciones disponibles para los jugadores'
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  nickname?: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => Position, { nullable: true })
  position?: Position; // Posición como jugador

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

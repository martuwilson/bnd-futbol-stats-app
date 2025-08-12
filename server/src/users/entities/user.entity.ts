import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER', 
  VIEWER = 'VIEWER'
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Los roles disponibles para los usuarios'
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

  @Field({ nullable: true })
  position?: string; // Posición como jugador

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

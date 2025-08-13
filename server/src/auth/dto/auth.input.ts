import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @Field()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  name: string;

  @Field()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @Field()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @Field(() => UserRole, { nullable: true, defaultValue: UserRole.VIEWER })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Rol de usuario inválido' })
  role?: UserRole;
}

@InputType()
export class RefreshTokenInput {
  @Field()
  @IsString()
  refreshToken: string;
}

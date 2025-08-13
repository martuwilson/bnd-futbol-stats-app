import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginInput, RegisterInput } from './dto/auth.input';
import { AuthResponse } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    // Verificar si el usuario ya existe
    const existingUser = await this.usersService.findByEmail(registerInput.email);
    if (existingUser) {
      throw new ConflictException('El usuario ya existe con este email');
    }

    // Crear usuario (UsersService ya se encarga del hash)
    const user = await this.usersService.createUser(registerInput);

    // Generar tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: user as any, // Casting temporal para resolver conflicto de tipos Prisma/GraphQL
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    // Buscar usuario por email
    const user = await this.usersService.findByEmail(loginInput.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const passwordValid = await bcrypt.compare(loginInput.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: user as any, // Casting temporal para resolver conflicto de tipos Prisma/GraphQL
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
      });

      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const newAccessToken = await this.generateAccessToken(user.id, user.email, user.role);

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async validateUser(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return user;
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { 
      sub: userId, 
      email, 
      role,
      type: 'access'
    };

    const refreshPayload = {
      sub: userId,
      type: 'refresh'
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '15m', // Access token expire en 15 minutos
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
        expiresIn: '7d', // Refresh token expire en 7 días
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(userId: string, email: string, role: string): Promise<string> {
    const payload = { 
      sub: userId, 
      email, 
      role,
      type: 'access'
    };

    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'your-secret-key',
      expiresIn: '15m',
    });
  }
}

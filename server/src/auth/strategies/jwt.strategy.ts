import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  type: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    // Verificar que es un access token
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Token tipo inválido');
    }

    // Validar que el usuario existe
    const user = await this.authService.validateUser(payload.sub);
    
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      user,
    };
  }
}

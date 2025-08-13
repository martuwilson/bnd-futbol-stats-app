import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { RolesGuard } from './roles/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    RolesGuard,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [
    AuthService,
    RolesGuard,
    JwtAuthGuard,
  ],
})
export class AuthModule {}

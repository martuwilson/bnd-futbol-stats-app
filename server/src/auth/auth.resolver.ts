import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, RegisterInput, RefreshTokenInput } from './dto/auth.input';
import { AuthResponse, RefreshResponse } from './entities/auth.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('input') registerInput: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(registerInput);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Mutation(() => RefreshResponse)
  async refreshToken(@Args('input') refreshTokenInput: RefreshTokenInput): Promise<RefreshResponse> {
    return this.authService.refreshToken(refreshTokenInput.refreshToken);
  }
}

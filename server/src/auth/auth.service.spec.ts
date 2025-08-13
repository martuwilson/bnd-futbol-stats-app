import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verify: jest.fn(),
  };

  const mockUser = {
    id: 'test-id',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    role: 'VIEWER',
    nickname: 'test',
    position: 'midfielder',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerInput = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'VIEWER' as any,
    };

    it('should register a new user successfully', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.createUser.mockResolvedValue(mockUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.register(registerInput);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(registerInput.email);
      expect(mockUsersService.createUser).toHaveBeenCalledWith(registerInput);
      expect(result).toMatchObject({
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerInput)).rejects.toThrow(ConflictException);
      expect(mockUsersService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginInput = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const userWithHashedPassword = { ...mockUser, password: hashedPassword };
      
      mockUsersService.findByEmail.mockResolvedValue(userWithHashedPassword);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.login(loginInput);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginInput.email);
      expect(result).toMatchObject({
        user: userWithHashedPassword,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginInput)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const userWithWrongPassword = { ...mockUser, password: 'wrong-hash' };
      mockUsersService.findByEmail.mockResolvedValue(userWithWrongPassword);

      await expect(service.login(loginInput)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const refreshToken = 'valid-refresh-token';
      const payload = { sub: 'test-id', type: 'refresh' };

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('new-access-token');

      const result = await service.refreshToken(refreshToken);

      expect(mockJwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
      });
      expect(result).toEqual({ accessToken: 'new-access-token' });
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      const refreshToken = 'invalid-refresh-token';
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user if found', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('test-id');

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(service.validateUser('invalid-id')).rejects.toThrow(UnauthorizedException);
    });
  });
});

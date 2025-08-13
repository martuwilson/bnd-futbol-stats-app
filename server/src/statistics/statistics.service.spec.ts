import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsService } from './statistics.service';
import { PrismaService } from '../prisma/prisma.service';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    match: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    matchPlayer: {
      findMany: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    playerStats: {
      aggregate: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
  };

  const mockUser = {
    id: 'user-1',
    name: 'Test Player',
    email: 'player@test.com',
    role: 'VIEWER',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlayerStatistics', () => {
    it('should return player statistics successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.playerStats.aggregate.mockResolvedValue({
        _sum: {
          goals: 10,
          assists: 5,
          yellowCards: 1,
          redCards: 0,
        },
        _count: {
          id: 5,
        },
      });

      const result = await service.getPlayerStatistics('user-1');

      expect(result).toBeDefined();
      expect(result.user).toEqual(mockUser);
      expect(result.totalGoals).toBe(10);
      expect(result.totalAssists).toBe(5);
      expect(result.totalMatches).toBe(5);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' }
      });
    });

    it('should throw error if player not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getPlayerStatistics('invalid-id')).rejects.toThrow();
    });
  });

  describe('getRanking', () => {
    it('should be defined', () => {
      expect(service.getRanking).toBeDefined();
    });
  });

  describe('getMatchAnalysis', () => {
    it('should be defined', () => {
      expect(service.getMatchAnalysis).toBeDefined();
    });
  });
});

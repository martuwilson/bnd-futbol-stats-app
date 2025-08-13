import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsResolver } from './statistics.resolver';
import { StatisticsService } from './statistics.service';

describe('StatisticsResolver', () => {
  let resolver: StatisticsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsResolver,
        {
          provide: StatisticsService,
          useValue: {
            getPlayerStatistics: jest.fn(),
            getRanking: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<StatisticsResolver>(StatisticsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

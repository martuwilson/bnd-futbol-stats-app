import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { 
  PlayerStatistics, 
  MatchStatistics, 
  SeasonStatistics, 
  PositionStatistics, 
  ComparisonStatistics 
} from './entities/statistics.entity';
import { 
  StatisticsFilterInput, 
  PlayerComparisonInput, 
  MatchAnalysisInput, 
  RankingInput 
} from './dto/statistics.input';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Resolver()
export class StatisticsResolver {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Query(() => PlayerStatistics, { name: 'playerStatistics' })
  async getPlayerStatistics(
    @Args('userId') userId: string,
    @Args('filter', { nullable: true }) filter?: StatisticsFilterInput,
  ) {
    return this.statisticsService.getPlayerStatistics(userId, filter);
  }

  @Query(() => [PlayerStatistics], { name: 'ranking' })
  async getRanking(@Args('input') input: RankingInput) {
    return this.statisticsService.getRanking(input);
  }

  @Query(() => MatchStatistics, { name: 'matchAnalysis' })
  async getMatchAnalysis(@Args('input') input: MatchAnalysisInput) {
    return this.statisticsService.getMatchAnalysis(input);
  }

  @Query(() => ComparisonStatistics, { name: 'comparePlayersStatistics' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async comparePlayersStatistics(@Args('input') input: PlayerComparisonInput) {
    return this.statisticsService.comparePlayersStatistics(input);
  }

  @Query(() => SeasonStatistics, { name: 'seasonStatistics' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  async getSeasonStatistics(
    @Args('filter', { nullable: true }) filter?: StatisticsFilterInput,
  ) {
    return this.statisticsService.getSeasonStatistics(filter);
  }

  @Query(() => [PositionStatistics], { name: 'positionStatistics' })
  async getPositionStatistics(
    @Args('filter', { nullable: true }) filter?: StatisticsFilterInput,
  ) {
    return this.statisticsService.getPositionStatistics(filter);
  }

  // Queries rápidas para el dashboard
  // Temporalmente comentado para resolver problemas de GraphQL schema
  /*
  @Query(() => [PlayerStatistics], { name: 'topScorers' })
  async getTopScorers(
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
  ) {
    return this.statisticsService.getRanking({
      category: 'goals',
      limit,
    });
  }

  @Query(() => [PlayerStatistics], { name: 'topAssists' })
  async getTopAssists(
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
  ) {
    return this.statisticsService.getRanking({
      category: 'assists',
      limit,
    });
  }

  @Query(() => [PlayerStatistics], { name: 'mostEffectivePlayers' })
  async getMostEffectivePlayers(
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
  ) {
    return this.statisticsService.getRanking({
      category: 'effectiveness',
      limit,
    });
  }
  */

  @Query(() => [PlayerStatistics], { name: 'mostActivePlayersPlayers' })
  async getMostActivePlayers(
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
  ) {
    return this.statisticsService.getRanking({
      category: 'matches',
      limit,
    });
  }
}

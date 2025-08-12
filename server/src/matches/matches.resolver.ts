import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MatchesService } from './matches.service';
import { Match } from './entities/match.entity';
import { 
  CreateMatchInput, 
  UpdateMatchInput, 
  AddPlayerToMatchInput, 
  UpdatePlayerStatsInput 
} from './dto/match.input';

@Resolver(() => Match)
export class MatchesResolver {
  constructor(private readonly matchesService: MatchesService) {}

  @Mutation(() => Match)
  async createMatch(@Args('data') createMatchInput: CreateMatchInput) {
    return this.matchesService.createMatch(createMatchInput);
  }

  @Query(() => [Match], { name: 'matches' })
  async findAll() {
    return this.matchesService.findAll();
  }

  @Query(() => [Match], { name: 'matchesByUser' })
  async findByUser(@Args('userId') userId: string) {
    return this.matchesService.findByUser(userId);
  }

  @Query(() => Match, { name: 'match', nullable: true })
  async findOne(@Args('id') id: string) {
    return this.matchesService.findOne(id);
  }

  @Mutation(() => Match)
  async updateMatch(
    @Args('id') id: string,
    @Args('data') updateMatchInput: UpdateMatchInput,
  ) {
    return this.matchesService.updateMatch(id, updateMatchInput);
  }

  @Mutation(() => Boolean)
  async deleteMatch(@Args('id') id: string) {
    await this.matchesService.deleteMatch(id);
    return true;
  }

  @Mutation(() => Match)
  async addPlayerToMatch(
    @Args('matchId') matchId: string,
    @Args('data') addPlayerInput: AddPlayerToMatchInput,
  ) {
    return this.matchesService.addPlayerToMatch(matchId, addPlayerInput);
  }

  @Mutation(() => Match)
  async removePlayerFromMatch(
    @Args('matchId') matchId: string,
    @Args('playerId') playerId: string,
  ) {
    return this.matchesService.removePlayerFromMatch(matchId, playerId);
  }

  @Mutation(() => Boolean)
  async updatePlayerStats(
    @Args('matchId') matchId: string,
    @Args('data') updateStatsInput: UpdatePlayerStatsInput,
  ) {
    await this.matchesService.updatePlayerStats(matchId, updateStatsInput);
    return true;
  }
}

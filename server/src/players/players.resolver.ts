import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PlayersService } from './players.service';
import { Player } from './entities/player.entity';
import { CreatePlayerInput, UpdatePlayerInput } from './dto/player.input';

@Resolver(() => Player)
export class PlayersResolver {
  constructor(private readonly playersService: PlayersService) {}

  @Mutation(() => Player)
  async createPlayer(@Args('data') createPlayerInput: CreatePlayerInput) {
    return this.playersService.createPlayer(createPlayerInput);
  }

  @Query(() => [Player], { name: 'players' })
  async findAll() {
    return this.playersService.findAll();
  }

  @Query(() => [Player], { name: 'playersByUser' })
  async findByUser(@Args('userId') userId: string) {
    return this.playersService.findByUser(userId);
  }

  @Query(() => Player, { name: 'player', nullable: true })
  async findOne(@Args('id') id: string) {
    return this.playersService.findOne(id);
  }

  @Mutation(() => Player)
  async updatePlayer(
    @Args('id') id: string,
    @Args('data') updatePlayerInput: UpdatePlayerInput,
  ) {
    return this.playersService.updatePlayer(id, updatePlayerInput);
  }

  @Mutation(() => Boolean)
  async deletePlayer(@Args('id') id: string) {
    await this.playersService.deletePlayer(id);
    return true;
  }
}

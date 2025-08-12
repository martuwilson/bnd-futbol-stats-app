import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CallUpsService } from './call-ups.service';
import { CallUp } from './entities/call-up.entity';
import { 
  CreateCallUpInput, 
  UpdateCallUpInput, 
  JoinCallUpInput 
} from './dto/call-up.input';

@Resolver(() => CallUp)
export class CallUpsResolver {
  constructor(private readonly callUpsService: CallUpsService) {}

  @Mutation(() => CallUp)
  async createCallUp(@Args('data') createCallUpInput: CreateCallUpInput) {
    return this.callUpsService.createCallUp(createCallUpInput);
  }

  @Query(() => [CallUp], { name: 'callUps' })
  async findAll() {
    return this.callUpsService.findAll();
  }

  @Query(() => [CallUp], { name: 'activeCallUps' })
  async findActive() {
    return this.callUpsService.findActive();
  }

  @Query(() => CallUp, { name: 'callUp', nullable: true })
  async findOne(@Args('id') id: string) {
    return this.callUpsService.findOne(id);
  }

  @Mutation(() => CallUp)
  async updateCallUp(
    @Args('id') id: string,
    @Args('data') updateCallUpInput: UpdateCallUpInput,
  ) {
    return this.callUpsService.updateCallUp(id, updateCallUpInput);
  }

  @Mutation(() => Boolean)
  async deleteCallUp(@Args('id') id: string) {
    await this.callUpsService.deleteCallUp(id);
    return true;
  }

  @Mutation(() => CallUp)
  async joinCallUp(@Args('data') joinCallUpInput: JoinCallUpInput) {
    return this.callUpsService.joinCallUp(joinCallUpInput);
  }

  @Mutation(() => CallUp)
  async leaveCallUp(
    @Args('callUpId') callUpId: string,
    @Args('userId') userId: string,
  ) {
    return this.callUpsService.leaveCallUp(callUpId, userId);
  }

  @Mutation(() => CallUp)
  async closeCallUp(@Args('id') id: string) {
    return this.callUpsService.closeCallUp(id);
  }
}

import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput, UpdateUserInput } from './dto/user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('data') createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user', nullable: true })
  async findOne(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('data') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.updateUser(id, updateUserInput);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string) {
    await this.usersService.deleteUser(id);
    return true;
  }

  // Queries específicas para administración
  @Query(() => [User], { name: 'admins' })
  async findAdmins() {
    return this.usersService.findAdmins();
  }

  @Mutation(() => User)
  async makeUserAdmin(@Args('userId') userId: string) {
    return this.usersService.makeUserAdmin(userId);
  }

  @Query(() => Boolean, { name: 'isAdmin' })
  async isAdmin(@Args('userId') userId: string) {
    return this.usersService.isAdmin(userId);
  }
}

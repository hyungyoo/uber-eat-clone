import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { createUserDtoInput } from "./dtos/create-user.dto";
import { User } from "./entities/users.entity";
import { UsersService } from "./users.service";

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly UsersService: UsersService) {}

  @Query((returns) => [User])
  getUsers() {
    return this.UsersService.getUsers();
  }

  @Mutation((returns) => Boolean)
  async createUser(@Args("input") createUserDtoInput: createUserDtoInput) {
    await this.UsersService.createUser(createUserDtoInput);
    return true;
  }
}

import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DisplayDtoResult } from "src/baseData/base.dto";
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

  @Mutation((returns) => DisplayDtoResult)
  async createUser(@Args("input") createUserDtoInput: createUserDtoInput) {
    return await this.UsersService.createUser(createUserDtoInput);
  }
}

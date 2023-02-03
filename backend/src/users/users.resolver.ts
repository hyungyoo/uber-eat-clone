import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { createUserDtoInput } from "./dtos/create-user.dto";
import { User } from "./entities/users.entity";
import { UsersService } from "./users.service";

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly UsersService: UsersService) {}

  @Query((returns) => User)
  getTest() {
    return "a";
  }

  @Mutation((returns) => Boolean)
  createUser(@Args("input") createUserDtoInput: createUserDtoInput) {
    return Boolean;
  }
}

import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { createUserInput } from "./dtos/create-user.dto";
import { User } from "./entities/users.entity";
import { UsersService } from "./users.service";

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Query((type) => String)
  getTest() {
    return "ha";
  }

  @Mutation((returns) => Boolean)
  createUser(@Args("input") createUserInput: createUserInput) {
    return true;
  }
}

import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DisplayDtoResult } from "src/baseData/base.dto";
import { CreateUserDto } from "./dtos/create-user.dto";
import { User } from "./entities/users.entity";
import { UsersService } from "./users.service";

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly UsersService: UsersService) {}

  @Query((returns) => [User])
  GetUsers() {
    return this.UsersService.GetUsers();
  }

  @Mutation((returns) => DisplayDtoResult)
  async CreateUser(@Args("input") CreateUserDto: CreateUserDto) {
    return await this.UsersService.CreateUser(CreateUserDto);
  }
}

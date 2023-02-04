import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DisplayResult } from "src/baseData/base.display.result";
import { CreateUserDto } from "./dtos/create-user.dto";
import { User } from "./entities/users.entity";
import { UsersService } from "./users.service";
import { LoginDto } from "./dtos/login.dto";

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly UsersService: UsersService) {}

  @Query((returns) => [User])
  GetUsers() {
    return this.UsersService.GetUsers();
  }

  @Query((returns) => DisplayResult)
  async Login(@Args("input") LoginDto: LoginDto) {
    return await this.UsersService.Login(LoginDto);
  }

  @Mutation((returns) => DisplayResult)
  async CreateUser(@Args("input") CreateUserDto: CreateUserDto) {
    return await this.UsersService.CreateUser(CreateUserDto);
  }
}

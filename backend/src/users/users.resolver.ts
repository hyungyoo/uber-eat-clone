import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateUserInput, CreateUserOutput } from "./dtos/create-user.dto";
import { User } from "./entities/users.entity";
import { UsersService } from "./users.service";
import { LoginDisplayResult, LoginDto } from "./dtos/login.dto";
import { UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/authorization/authorization.guard";
import { AuthUser } from "src/authorization/auth-user.decorator";
import { GetUsersOutput } from "./dtos/get-users.dto";
import { GetUserInput, GetUserOutput } from "./dtos/get-user.dto";
import { EditUserInput, EditUserOutput } from "./dtos/edit-user.dto";
import { DeleteUserInput, DeleteUserOutput } from "./dtos/delete-user.dto";

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => GetUsersOutput)
  users() {
    return this.usersService.users();
  }

  @Query((returns) => GetUserOutput)
  async user(@Args("input") { id }: GetUserInput) {
    return this.usersService.findUserById(id);
  }

  @Query((returns) => User)
  @UseGuards(AuthorizationGuard)
  myProfile(@AuthUser() User: User) {
    return User;
  }

  @Query((returns) => LoginDisplayResult)
  async login(@Args("input") LoginDto: LoginDto) {
    return await this.usersService.login(LoginDto);
  }

  @Mutation((returns) => CreateUserOutput)
  async createUser(@Args("input") CreateUserInput: CreateUserInput) {
    return await this.usersService.createUser(CreateUserInput);
  }

  @Mutation((returns) => EditUserOutput)
  @UseGuards(AuthorizationGuard)
  async updateUser(
    @AuthUser() { id }: User,
    @Args("input") EditUserInput: EditUserInput
  ): Promise<EditUserOutput> {
    return this.usersService.updateUser(id, EditUserInput);
  }

  @Mutation((returns) => DeleteUserOutput)
  async deleteUser(@Args("input") { id }: DeleteUserInput) {
    return await this.usersService.deleteUserById(id);
  }
}

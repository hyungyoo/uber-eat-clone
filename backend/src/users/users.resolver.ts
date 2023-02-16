import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateUserInput, CreateUserOutput } from "./dtos/create-user.dto";
import { User } from "./entities/users.entity";
import { UsersService } from "./users.service";
import { LoginOutput, LoginInput } from "./dtos/login.dto";
import { GetUsersOutput } from "./dtos/get-users.dto";
import { GetUserInput, GetUserOutput } from "./dtos/get-user.dto";
import { UpdateUserInput, UpdateUserOutput } from "./dtos/update-user.dto";
import { DeleteUserInput, DeleteUserOutput } from "./dtos/delete-user.dto";
import { INPUT_ARG } from "src/baseData/consts/base.consts";
import { AuthUser } from "src/auth/decorators/auth-user.decorator";
import { UserRole } from "src/auth/decorators/roles.decorator";

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {
    console.log("constructor user resolver called");
  }

  @Query((returns) => GetUsersOutput)
  @UserRole("USER")
  users() {
    return this.usersService.users();
  }

  @Query((returns) => GetUserOutput)
  @UserRole("USER")
  async user(@Args(INPUT_ARG) getUserInput: GetUserInput) {
    return this.usersService.findUserById(getUserInput);
  }

  @Query((returns) => LoginOutput)
  async login(@Args(INPUT_ARG) loginInput: LoginInput) {
    return await this.usersService.login(loginInput);
  }

  @Mutation((returns) => CreateUserOutput)
  async createUser(@Args(INPUT_ARG) CreateUserInput: CreateUserInput) {
    return await this.usersService.createUser(CreateUserInput);
  }

  @Query((returns) => User)
  @UserRole("USER")
  myProfile(@AuthUser() User: User) {
    return User;
  }

  @Mutation((returns) => UpdateUserOutput)
  @UserRole("USER")
  async updateUser(
    @AuthUser() { id }: User,
    @Args(INPUT_ARG) UpdateUserInput: UpdateUserInput
  ): Promise<UpdateUserOutput> {
    return this.usersService.updateUser(id, UpdateUserInput);
  }

  @Mutation((returns) => DeleteUserOutput)
  @UserRole("USER")
  async deleteUser(@Args(INPUT_ARG) deleteUserInput: DeleteUserInput) {
    return await this.usersService.deleteUserById(deleteUserInput);
  }
}

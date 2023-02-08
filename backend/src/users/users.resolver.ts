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
  constructor(private readonly UsersService: UsersService) {}

  @Query((returns) => GetUsersOutput)
  GetUsers() {
    return this.UsersService.GetUsers();
  }

  @Query((returns) => LoginDisplayResult)
  async Login(@Args("input") LoginDto: LoginDto) {
    return await this.UsersService.Login(LoginDto);
  }

  @Mutation((returns) => CreateUserOutput)
  async CreateUser(@Args("input") CreateUserInput: CreateUserInput) {
    return await this.UsersService.CreateUser(CreateUserInput);
  }

  @Mutation((returns) => EditUserOutput)
  @UseGuards(AuthorizationGuard)
  async EditUser(
    @AuthUser() { id }: User,
    @Args("input") EditUserInput: EditUserInput
  ): Promise<EditUserOutput> {
    return this.UsersService.EditUser(id, EditUserInput);
  }

  @Mutation((returns) => DeleteUserOutput)
  async DeleteUser(@Args("input") { id }: DeleteUserInput) {
    return await this.UsersService.DeleteUserById(id);
  }

  @Query((returns) => User)
  @UseGuards(AuthorizationGuard)
  GetMyProfile(@AuthUser() User: User) {
    return User;
  }

  @Query((returns) => GetUserOutput)
  async GetUser(@Args("input") { id }: GetUserInput) {
    return this.UsersService.FindUserById(id);
  }
}

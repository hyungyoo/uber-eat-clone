import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserInput, CreateUserOutput } from "./dtos/create-user.dto";
import { User } from "./entities/users.entity";
import { LoginDisplayResult, LoginDto } from "./dtos/login.dto";
import { JwtService } from "src/jwt/jwt.service";
import { GetUsersOutput } from "./dtos/get-users.dto";
import { GetUserOutput } from "./dtos/get-user.dto";
import { EditUserInput, EditUserOutput } from "./dtos/edit-user.dto";
import { DeleteUserOutput } from "./dtos/delete-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
    private readonly JwtService: JwtService
  ) {}

  /**
   * get all users in database of users
   * @return return status code, info of all users
   */
  async GetUsers(): Promise<GetUsersOutput> {
    try {
      const users = await this.UserRepository.find();
      if (!users) throw Error();
      return {
        isOk: true,
        users,
      };
    } catch (errorMessage) {
      return {
        isOk: false,
        errorMessage,
      };
    }
  }

  /**
   *  creation de nouveau user:
   *  en premier, check avec email afin de ne pas inscrire avec meme email
   *  en dexieme, creation nouveau user
   *  en troiseme, hash de la PW
   * @param param0 email, password, role
   * @return status code, User info of the created user
   */
  async CreateUser(
    CreateUserInput: CreateUserInput
  ): Promise<CreateUserOutput> {
    try {
      const IsUsertWithEmail = await this.UserRepository.findOneBy({
        email: CreateUserInput.email,
      });
      if (IsUsertWithEmail) throw "this email already exists";
      const EntityUser = this.UserRepository.create({
        ...CreateUserInput,
      });
      const user = await this.UserRepository.save(EntityUser);
      return { isOk: true, user };
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
    }
  }

  /**
   * get id and email / password
   * edit profile of user who has same id
   * @param id
   * @param EditUserInput
   * @returns status code, user info of the changed user
   */
  async EditUser(
    id: number,
    EditUserInput: EditUserInput
  ): Promise<EditUserOutput> {
    try {
      const userEntity = await this.UserRepository.findOne({ where: { id } });
      const user = this.UserRepository.create({
        ...userEntity,
        ...EditUserInput,
      });
      await this.UserRepository.save(user);
      return {
        isOk: true,
        user,
      };
    } catch (errorMessage) {
      return {
        isOk: false,
        errorMessage,
      };
    }
  }

  /**
   * delete user with id
   * @param id
   * @returns status code, user info of the deleted user
   */
  async DeleteUserById(id: number): Promise<DeleteUserOutput> {
    try {
      const user = await this.UserRepository.findOne({ where: { id } });
      if (!user) throw "this user not exists";
      const deleteUser = await this.UserRepository.delete(id);
      return {
        isOk: true,
        user,
      };
    } catch (errorMessage) {
      return {
        isOk: false,
        errorMessage,
      };
    }
  }

  /**
   * 1. check user email
   * 2. comparer with password in users entitie class function for access user password
   * 3. generate token
   * @param param0 email, password
   * @returns status code, token
   */
  async Login({ email, password }: LoginDto): Promise<LoginDisplayResult> {
    try {
      const IsUser = await this.UserRepository.findOneBy({ email });
      if (!IsUser)
        return { isOk: false, errorMessage: "user not exists wtih this email" };
      const isCorrectPW = await IsUser.ValidatePW(password);
      return {
        isOk: Boolean(isCorrectPW),
        token: isCorrectPW ? this.JwtService.SignToken({ id: IsUser.id }) : "",
        errorMessage: !isCorrectPW ? "password not correct" : "",
      };
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
    }
  }

  /**
   * find user from id
   * @param id
   * @returns status code, user info of the requested user
   */
  async FindUserById(id: number): Promise<GetUserOutput> {
    try {
      const user = await this.UserRepository.findOneBy({ id });
      if (!user) throw Error();
      return {
        isOk: true,
        user,
      };
    } catch (errorMessage) {
      return {
        isOk: false,
        errorMessage,
      };
    }
  }
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DisplayResult } from "src/baseData/base.display.result";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { User } from "./entities/users.entity";
import { LoginDisplayResult, LoginDto } from "./dtos/login.dto";
import { JwtService } from "src/jwt/jwt.service";
import { GetUsersOutput } from "./dtos/get-users.dto";
import { GetUserOutput } from "./dtos/get-user.dto";
import { EditUserInput } from "./dtos/edit-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
    private readonly JwtService: JwtService
  ) {}

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
   */
  async CreateUser({
    email,
    name,
    password,
    role,
  }: CreateUserDto): Promise<DisplayResult> {
    try {
      const IsUsertWithEmail = await this.UserRepository.findOneBy({ email });
      if (IsUsertWithEmail)
        return { isOk: false, errorMessage: "this email already exists" };
      const EntityUser = this.UserRepository.create({
        email,
        name,
        password,
        role,
      });
      await this.UserRepository.save(EntityUser);
      return { isOk: true };
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
    }
  }

  async EditUser(
    id: number,
    EditUserInput: EditUserInput
  ): Promise<DisplayResult> {
    try {
      const user = await this.UserRepository.findOne({ where: { id } });
      const userChanged = this.UserRepository.create({
        ...user,
        ...EditUserInput,
      });
      await this.UserRepository.save(userChanged);
      return {
        isOk: true,
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
   * @returns DisplayResult with token
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
   * @returns
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

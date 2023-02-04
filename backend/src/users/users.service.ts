import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DisplayResult } from "src/baseData/base.display.result";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { User } from "./entities/users.entity";
import { LoginDto } from "./dtos/login.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>
  ) {}

  async GetUsers(): Promise<DisplayResult | User[]> {
    try {
      return await this.UserRepository.find();
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
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
    password,
    role,
  }: CreateUserDto): Promise<DisplayResult> {
    try {
      const IsUsertWithEmail = await this.UserRepository.findOneBy({ email });
      if (IsUsertWithEmail)
        return { isOk: false, errorMessage: "this email already exists" };
      const EntityUser = this.UserRepository.create({ email, password, role });
      await this.UserRepository.save(EntityUser);
      return { isOk: true };
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
    }
  }

  /**
   * 1. check user email
   * 2. comparer with password in users entitie class function for access user password
   * 3. generate token
   * @param param0 email, password
   * @returns DisplayResult with token
   */
  async Login({ email, password }: LoginDto): Promise<DisplayResult> {
    try {
      const IsUser = await this.UserRepository.findOneBy({ email });
      if (!IsUser)
        return { isOk: false, errorMessage: "user not exists wtih this email" };
      return IsUser.ValidatePW(password);
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
    }
  }
}

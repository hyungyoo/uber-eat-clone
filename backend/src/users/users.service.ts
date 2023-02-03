import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DisplayDtoResult } from "src/baseData/base.dto";
import { Repository } from "typeorm";
import { createUserDtoInput } from "./dtos/create-user.dto";
import { User } from "./entities/users.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async getUsers(): Promise<DisplayDtoResult | User[]> {
    try {
      return await this.userRepository.find();
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
    }
  }

  /**
   *  creation de nouveau user:
   *  en premier, check avec email afin de ne pas inscrire avec meme email
   *  en dexieme, creation nouveau user
   *  en troiseme, hash de la PW
   * @param param email, password, role
   */
  async createUser({
    email,
    password,
    role,
  }: createUserDtoInput): Promise<DisplayDtoResult> {
    try {
      const isClientWithEmail = await this.userRepository.findOneBy({ email });
      if (isClientWithEmail)
        return { isOk: false, errorMessage: "this email already exists" };
      const entityUser = this.userRepository.create({ email, password, role });
      await this.userRepository.save(entityUser);
      return { isOk: true };
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
    }
  }
}

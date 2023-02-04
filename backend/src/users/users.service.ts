import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DisplayDtoResult } from "src/baseData/base.dto";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { User } from "./entities/users.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>
  ) {}

  async GetUsers(): Promise<DisplayDtoResult | User[]> {
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
   * @param param email, password, role
   */
  async CreateUser({
    email,
    password,
    role,
  }: CreateUserDto): Promise<DisplayDtoResult> {
    try {
      const IsClientWithEmail = await this.UserRepository.findOneBy({ email });
      if (IsClientWithEmail)
        return { isOk: false, errorMessage: "this email already exists" };
      const EntityUser = this.UserRepository.create({ email, password, role });
      await this.UserRepository.save(EntityUser);
      return { isOk: true };
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
    }
  }
}

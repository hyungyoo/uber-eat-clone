import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { createUserDtoInput } from "./dtos/create-user.dto";
import { User } from "./entities/users.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async getUsers() {
    try {
      return await this.userRepository.find();
    } catch (e) {
      console.log(e);
    }
  }

  /**
   *  creation de nouveau user:
   *  en premier, check avec email afin de ne pas inscrire avec meme email
   *  en dexieme, creation nouveau user
   *  en troiseme, hash de la PW
   * @param param email, password, role
   */
  async createUser({ email, password, role }: createUserDtoInput) {
    try {
      const isClientWithEmail = await this.userRepository.findOneBy({ email });
      if (isClientWithEmail) return;
      const entityUser = this.userRepository.create({ email, password, role });
      await this.userRepository.save(entityUser);
      return true;
    } catch (e) {
      console.log("error");
    }
  }
}

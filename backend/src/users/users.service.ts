import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserInput, CreateUserOutput } from "./dtos/create-user.dto";
import { User } from "./entities/users.entity";
import { LoginDisplayResult, LoginDto } from "./dtos/login.dto";
import { JwtService } from "src/jwt/jwt.service";
import { GetUsersOutput } from "./dtos/get-users.dto";
import { GetUserOutput } from "./dtos/get-user.dto";
import { UpdateUserInput, UpdateUserOutput } from "./dtos/update-user.dto";
import { DeleteUserOutput } from "./dtos/delete-user.dto";
import { EmailVerification } from "src/email/entities/email.verification.entity";
import { EmailService } from "src/email/email.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
  ) {}

  /**
   * get all users in database of users
   * @return return status code, info of all users
   */
  async users(): Promise<GetUsersOutput> {
    try {
      const users = await this.userRepository.find();
      if (!users) throw "fail to get users infos";
      return {
        isOk: true,
        users,
      };
    } catch (e) {
      return {
        isOk: false,
        errorMessage: "fail to get users infos",
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
  async createUser(
    CreateUserInput: CreateUserInput
  ): Promise<CreateUserOutput> {
    try {
      if (await this.isUserWithEmail(CreateUserInput.email))
        throw "this email already exists";
      const EntityUser = this.userRepository.create({
        ...CreateUserInput,
      });
      const user = await this.userRepository.save(EntityUser);
      if (!user) throw "fail save user";
      const emailVerified = await this.emailVerificationRepository.save(
        this.emailVerificationRepository.create({ user })
      );
      if (!emailVerified) throw "fail save email verified entity";
      this.emailService.sendMail(
        user.email,
        user.name,
        emailVerified.verificationCode
      );
      return { user, emailVerified };
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
    }
  }

  /**
   * get id and email / password
   * edit profile of user who has same id
   * @param id
   * @param UpdateUserInput
   * @returns status code, user info of the changed user
   */
  async updateUser(
    id: number,
    UpdateUserInput: UpdateUserInput
  ): Promise<UpdateUserOutput> {
    try {
      if (await this.isUserWithEmail(UpdateUserInput.email))
        throw "this email already exists";
      const userEntity = await this.userRepository.findOne({ where: { id } });
      const user = this.userRepository.create({
        ...userEntity,
        ...UpdateUserInput,
      });
      user.isVerified = false;
      await this.userRepository.save(user);
      const emailVerified = await this.emailVerificationRepository.save(
        this.emailVerificationRepository.create({ user })
      );
      this.emailService.sendMail(
        user.email,
        user.name,
        emailVerified.verificationCode
      );
      return {
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
  async deleteUserById(id: number): Promise<DeleteUserOutput> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw "this user not exists";
      await this.userRepository.delete(id);
      return {
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
  async login({ email, password }: LoginDto): Promise<LoginDisplayResult> {
    try {
      const IsUser = await this.userRepository.findOne({
        where: { email },
        select: ["password"],
      });
      console.log(IsUser);
      if (!IsUser)
        return { isOk: false, errorMessage: "user not exists wtih this email" };
      const isCorrectPW = await IsUser.ValidatePW(password);
      if (!isCorrectPW) throw "password not correct";
      return {
        token: this.jwtService.signToken({ id: IsUser.id }),
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
  async findUserById(id: number): Promise<GetUserOutput> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw Error();
      return { user };
    } catch (errorMessage) {
      return {
        isOk: false,
        errorMessage,
      };
    }
  }

  private async isUserWithEmail(email: string): Promise<Boolean> {
    try {
      const isAleadyEmail = await this.userRepository.findOne({
        where: { email },
      });
      if (isAleadyEmail) throw "this email already exists";
      return false;
    } catch (e) {
      return true;
    }
  }
}

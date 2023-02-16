import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserInput, CreateUserOutput } from "./dtos/create-user.dto";
import { User } from "./entities/users.entity";
import { LoginOutput, LoginInput } from "./dtos/login.dto";
import { JwtService } from "src/jwt/jwt.service";
import { GetUsersOutput } from "./dtos/get-users.dto";
import { GetUserInput, GetUserOutput } from "./dtos/get-user.dto";
import { UpdateUserInput, UpdateUserOutput } from "./dtos/update-user.dto";
import { DeleteUserInput, DeleteUserOutput } from "./dtos/delete-user.dto";
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
  ) {
    console.log("user service called");
  }

  /**
   * get all users in database of users
   * @return status, errorMessage, info of all users
   */
  async users(): Promise<GetUsersOutput> {
    try {
      const users = await this.userRepository.find();
      return {
        isOk: true,
        users,
      };
    } catch {
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
   * @return status, errorMessage, User info of the created user
   */
  async createUser(
    createUserInput: CreateUserInput
  ): Promise<CreateUserOutput> {
    try {
      const isAleadyEmail = await this.userRepository.findOne({
        where: { email: createUserInput.email },
      });
      if (isAleadyEmail) throw "this email already exists";
      const entityUser = this.userRepository.create({
        ...createUserInput,
      });
      const user = await this.userRepository.save(entityUser);
      const emailVerified = await this.emailVerificationRepository.save(
        this.emailVerificationRepository.create({ user })
      );
      await this.emailService.sendMail(
        user.email,
        user.name,
        "verification for create",
        "uber_eat_email_verification",
        emailVerified.verificationCode
      );
      return { emailVerified };
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
    }
  }

  /**
   * get id and email / password
   * edit profile of user who has same id
   * @param id
   * @param UpdateUserInput
   * @returns status, errorMessage, user info of the changed user
   */
  async updateUser(
    id: number,
    updateUserInput: UpdateUserInput
  ): Promise<UpdateUserOutput> {
    try {
      const isAleadyEmail = await this.userRepository.findOne({
        where: { email: updateUserInput.email },
      });
      if (isAleadyEmail) throw "this email already exists";
      const userEntity = await this.userRepository.findOne({ where: { id } });
      const user = this.userRepository.create({
        ...userEntity,
        ...updateUserInput,
      });
      await this.emailVerificationRepository.delete({
        user: { id: user.id },
      });
      await this.userRepository.save(user);
      const emailVerified = await this.emailVerificationRepository.save(
        this.emailVerificationRepository.create({ user })
      );
      await this.emailService.sendMail(
        user.email,
        user.name,
        "verification for update",
        "uber_eat_email_verification",
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
   * @returns status, errorMessage, user info of the deleted user
   */
  async deleteUserById({ id }: DeleteUserInput): Promise<DeleteUserOutput> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
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
   * @returns status, errorMessage, token
   */
  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const IsUser = await this.userRepository.findOne({
        where: { email },
        select: ["password", "id"],
      });
      if (!IsUser)
        return { isOk: false, errorMessage: "user not exists with this email" };
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
   * @returns status, errorMessage, user info of the requested user
   */
  async findUserById({ id }: GetUserInput): Promise<GetUserOutput> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw "user not found";
      return { user };
    } catch (errorMessage) {
      return {
        isOk: false,
        errorMessage,
      };
    }
  }
}

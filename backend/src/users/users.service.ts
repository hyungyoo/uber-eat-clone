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
  ) {}

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
      if (createUserInput.role === "admin")
        throw "create account with admin is not allowed";
      const isEmailExists = await this.userRepository.findOne({
        where: { email: createUserInput.email },
      });
      if (isEmailExists) throw "this email already exists";
      const userEntity = this.userRepository.create({
        ...createUserInput,
      });
      const user = await this.userRepository.save(userEntity);
      const emailVerified = await this.emailVerificationRepository.save(
        this.emailVerificationRepository.create({ user })
      );
      await this.emailService.sendMail(
        user.email,
        user.name,
        "verification for create",
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
      const isEmailExists = await this.userRepository.findOne({
        where: { email: updateUserInput.email },
      });
      if (isEmailExists) throw "this email already exists";
      const userEntity = await this.userRepository.findOne({ where: { id } });
      const userUpdated = this.userRepository.create({
        ...userEntity,
        ...updateUserInput,
      });
      await this.emailVerificationRepository.delete({
        user: { id: userUpdated.id },
      });
      await this.userRepository.save(userUpdated);
      const emailVerified = await this.emailVerificationRepository.save(
        this.emailVerificationRepository.create({ user: userUpdated })
      );
      await this.emailService.sendMail(
        userUpdated.email,
        userUpdated.name,
        "verification for update",
        emailVerified.verificationCode
      );
      return {
        user: userUpdated,
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
      const userEntity = await this.userRepository.findOne({
        where: { id },
      });
      if (!userEntity) throw "this user not exists";
      await this.userRepository.delete({ id });
      return {
        user: userEntity,
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
      const userEntity = await this.userRepository.findOne({
        where: { email },
        select: ["password", "id"],
      });
      if (!userEntity) throw "user not exists with this email";
      const isCorrectPW = await userEntity.ValidatePW(password);
      if (!isCorrectPW) throw "password not correct";
      return {
        token: this.jwtService.signToken({ id: userEntity.id }),
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
      const user: User = await this.userRepository.findOne({ where: { id } });
      if (!user || !id) throw "user not found";
      return { user };
    } catch (errorMessage) {
      return {
        isOk: false,
        errorMessage,
      };
    }
  }
}

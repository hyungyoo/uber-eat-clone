import { Test } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { EmailVerification } from "src/email/entities/email.verification.entity";
import { JwtService } from "src/jwt/jwt.service";
import { EmailService } from "src/email/email.service";
import { Repository } from "typeorm";
import { CreateUserInput } from "./dtos/create-user.dto";
import { UpdateUserInput } from "./dtos/update-user.dto";
import { LoginInput } from "./dtos/login.dto";
import { GetUserInput } from "./dtos/get-user.dto";
import { DeleteUserInput } from "./dtos/delete-user.dto";

/**
 * Mock Types
 */
const MockRepository = () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const MockJwtService = () => ({
  signToken: jest.fn(),
  verifyToken: jest.fn(),
});

const MockEmailService = () => ({
  sendMail: jest.fn(),
  verifierEmailCode: jest.fn(),
});

/**
 * type for MockRespository
 */
type MockTypeRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

/**
 * UsersService test
 */
describe("UsersService", () => {
  /**
   * variables
   */
  let userRepository: MockTypeRepository<User>;
  let emailVerificationRepository: MockTypeRepository<EmailVerification>;
  let jwtService: JwtService;
  let emailService: EmailService;
  let usersService: UsersService;

  /**
   * make mock modoule and mock providers
   * set variables
   */
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: MockRepository(),
        },
        {
          provide: getRepositoryToken(EmailVerification),
          useValue: MockRepository(),
        },
        {
          provide: JwtService,
          useValue: MockJwtService(),
        },
        {
          provide: EmailService,
          useValue: MockEmailService(),
        },
      ],
    }).compile();

    userRepository = moduleRef.get(getRepositoryToken(User));
    emailVerificationRepository = moduleRef.get(
      getRepositoryToken(EmailVerification)
    );
    jwtService = moduleRef.get(JwtService);
    emailService = moduleRef.get(EmailService);
    usersService = moduleRef.get(UsersService);
  });

  /**
   * dummy user
   */

  const ID: number = 1;

  const ROLE: number = 0;

  const dummyUser = {
    id: ID,
    email: "hjyoo901112@gmail.com",
    name: "hyungyoo",
    password: "12345",
    isVerified: false,
    role: ROLE,
  };

  const createUserArgs: CreateUserInput = {
    email: "hjyoo901112@gmail.com",
    name: "hyungyoo",
    password: "12345",
    role: ROLE,
  };

  const updateUserArgs: UpdateUserInput = {
    email: "hjyoo901112@gmail.com",
    password: "12345",
    name: "hyungyoo",
  };

  const loginArgs: LoginInput = {
    email: "hyungyoo@gmail.com",
    password: "12345",
  };

  const getUserArgs: GetUserInput = {
    id: ID,
  };

  const deleteUserArgs: DeleteUserInput = {
    id: ID,
  };

  /**
   * repositories, services should be defined
   */
  it("should be defined", () => {
    expect(userRepository).toBeDefined();
    expect(emailVerificationRepository).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(emailService).toBeDefined();
  });

  /**
   * get users
   */
  describe("users", () => {
    it("should be return empty array and not return errro", async () => {
      userRepository.find.mockResolvedValue([]);
      const result = await usersService.users();
      expect(userRepository.find).toHaveBeenCalledTimes(1);
      expect(userRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual({ isOk: true, users: [] });
    });

    it("should fail if find throw error", async () => {
      userRepository.find.mockRejectedValue(Promise.reject);
      const result = await usersService.users();
      expect(userRepository.find).toHaveBeenCalledTimes(1);
      expect(userRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual({
        isOk: false,
        errorMessage: "fail to get users infos",
      });
    });

    it("should be success", async () => {
      userRepository.find.mockResolvedValue(expect.any(Array<User>));
      const result = await usersService.users();
      expect(userRepository.find).toHaveBeenCalledWith();
      expect(userRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ isOk: true, users: expect.any(Array<User>) });
    });
  });

  /**
   * create user
   */
  describe("createUser", () => {
    it("should be fail if email already exists", async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await usersService.createUser(createUserArgs);
      expect(result).toEqual({
        isOk: false,
        errorMessage: "this email already exists",
      });
    });

    it("should create user", async () => {
      userRepository.findOne.mockResolvedValueOnce(undefined);
      userRepository.create.mockReturnValue(dummyUser);
      userRepository.save.mockResolvedValue(dummyUser);
      emailVerificationRepository.create.mockReturnValue({
        user: createUserArgs,
      });
      emailVerificationRepository.save.mockResolvedValue({
        id: ID,
        verificationCode: expect.any(String),
        user: createUserArgs,
      });
      const result = await usersService.createUser(createUserArgs);
      expect(result).toEqual({
        emailVerified: {
          id: ID,
          verificationCode: expect.any(String),
          user: createUserArgs,
        },
      });

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserArgs.email },
      });
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(createUserArgs);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(dummyUser);
      expect(emailVerificationRepository.create).toHaveBeenCalledTimes(1);
      expect(emailVerificationRepository.create).toHaveBeenCalledWith({
        user: dummyUser,
      });
      expect(emailVerificationRepository.save).toHaveBeenCalledTimes(1);
      expect(emailVerificationRepository.save).toHaveBeenCalledWith({
        user: createUserArgs,
      });
      expect(emailService.sendMail).toHaveBeenCalledTimes(1);
      expect(emailService.sendMail).toHaveBeenCalledWith(
        createUserArgs.email,
        createUserArgs.name,
        "verification for create",
        "uber_eat_email_verification",
        expect.any(String)
      );
    });
  });

  describe("updateUser", () => {
    it("should be fail if email already exists", async () => {
      userRepository.findOne.mockRejectedValueOnce(updateUserArgs);
      const result = await usersService.updateUser(1, updateUserArgs);
      expect(result).toEqual({
        isOk: false,
        errorMessage: "this email already exists",
      });
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: updateUserArgs.email },
      });
    });

    it("should update user", async () => {
      userRepository.findOne.mockResolvedValueOnce(undefined);
      userRepository.findOne.mockResolvedValueOnce(dummyUser);
      userRepository.create.mockReturnValue(dummyUser);
      userRepository.save.mockResolvedValue(dummyUser);

      emailVerificationRepository.create({ user: dummyUser });
      emailVerificationRepository.save(dummyUser);

      const result = await usersService.updateUser(ID, updateUserArgs);

      expect(userRepository.findOne).toHaveBeenCalledTimes(2);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: updateUserArgs.email },
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: ID },
      });

      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(dummyUser);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(dummyUser);
      expect(emailVerificationRepository.create).toHaveBeenCalledTimes(1);
      expect(emailVerificationRepository.create).toHaveBeenCalledWith({
        user: dummyUser,
      });
      // expect(emailVerificationRepository.save).toHaveBeenCalledTimes(2);
      // expect(emailVerificationRepository.save).toHaveBeenCalledWith(dummyUser);
      // expect(emailService.sendMail).toHaveBeenCalledTimes(1);
      // expect(emailService.sendMail).toHaveBeenCalledWith(
      //   updateUserArgs.email,
      //   updateUserArgs.name,
      //   "verification for update",
      //   "uber_eat_email_verification",
      //   expect.any(String)
      // );
    });
    // it("", () => {});
    // it("", () => {});
    // it("", () => {});
    // it("", () => {});
  });

  // describe("deleteUserById", () => {
  //   it("", () => {});
  //   it("", () => {});
  //   it("", () => {});
  //   it("", () => {});
  //   it("", () => {});
  // });
  // describe("login", () => {
  //   it("", () => {});
  //   it("", () => {});
  //   it("", () => {});
  //   it("", () => {});
  //   it("", () => {});
  // });
  // describe("findUserById", () => {
  //   it("", () => {});
  //   it("", () => {});
  //   it("", () => {});
  //   it("", () => {});
  //   it("", () => {});
  // });
});

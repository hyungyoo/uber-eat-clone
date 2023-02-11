import { Test } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { EmailVerification } from "src/email/entities/email.verification.entity";
import { JwtService } from "src/jwt/jwt.service";
import { EmailService } from "src/email/email.service";
import { Repository } from "typeorm";
import { CreateUserInput } from "./dtos/create-user.dto";

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

const MockJwtService = {
  signToken: jest.fn(),
  verifyToken: jest.fn(),
};

const MockEmailService = {
  sendMail: jest.fn(),
  verifierEmailCode: jest.fn(),
};

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
          useValue: MockJwtService,
        },
        {
          provide: EmailService,
          useValue: MockEmailService,
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
    const createUserInput: CreateUserInput = {
      name: "hyungyoo",
      email: "hyungoo@gmail.com",
      password: "12345",
      role: 0,
    };
    it("should be fail if email already exists", async () => {
      userRepository.findOne.mockResolvedValue(expect.any(Object));
      const result = await usersService.createUser(createUserInput);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserInput.email },
      });
      expect(result).toEqual({
        isOk: false,
        errorMessage: "this email already exists",
      });
    });
    it("should be fail if user cannot created", async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.create.mockReturnValue(createUserInput);
      userRepository.save.mockResolvedValue(undefined);
      const result = await usersService.createUser(createUserInput);
      expect(result).toEqual({ isOk: false, errorMessage: "fail save user" });
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(createUserInput);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(createUserInput);
    });
    it("should be fail if emailVerified cannot created", async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.create.mockReturnValue(createUserInput);
      userRepository.save.mockResolvedValue(createUserInput);
      emailVerificationRepository.create.mockReturnValue(undefined);
      emailVerificationRepository.save.mockResolvedValue(undefined);
      const result = await usersService.createUser(createUserInput);
      expect(result).toEqual({
        isOk: false,
        errorMessage: "fail save email verified entity",
      });
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(createUserInput);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(createUserInput);
    });

    it("should be work", async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.create.mockReturnValue(createUserInput);
      userRepository.save.mockResolvedValue(createUserInput);
      emailVerificationRepository.create.mockReturnValue(expect.any(Object));
      emailVerificationRepository.save.mockResolvedValue(expect.any(Object));
      const result = await usersService.createUser(createUserInput);
      expect(result).toEqual({
        user: createUserInput,
        emailVerified: expect.any(Object),
      });
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(createUserInput);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(createUserInput);
      expect(emailVerificationRepository.create).toHaveBeenCalledTimes(1);
      expect(emailVerificationRepository.create).toHaveBeenCalledWith({
        user: createUserInput,
      });
      expect(emailVerificationRepository.save).toHaveBeenCalledTimes(1);
      expect(emailVerificationRepository.save).toHaveBeenCalledWith({
        user: createUserInput,
      });
      expect(emailService.sendMail).toHaveBeenCalledTimes(1);
    });
  });

  // it("", async () => {});
  // describe("updateUser", () => {
  //   it("", () => {});
  // });
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

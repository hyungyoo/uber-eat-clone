import { Test } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { EmailVerification } from "src/email/entities/email.verification.entity";
import { JwtService } from "src/jwt/jwt.service";
import { EmailService } from "src/email/email.service";

/**
 * Mock Types
 */
const MockRepository = {
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const MockJwtService = {
  signToken: jest.fn(),
  verifyToken: jest.fn(),
};

const MockEmailService = {
  sendMail: jest.fn(),
  verifierEmailCode: jest.fn(),
};

/**
 * UsersService test
 */
describe("UsersService", () => {
  /**
   * variables
   */
  let userRepository;
  let emailVerificationRepository;
  let jwtService: JwtService;
  let emailService: EmailService;

  /**
   * make mock modoule and mock providers
   * set variables
   */
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: MockRepository,
        },
        {
          provide: getRepositoryToken(EmailVerification),
          useValue: MockRepository,
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
    it.todo("should be error, if userRepository not found users");
    it.todo("should be success");
  });
  describe("createUser", () => {
    it.todo("should be error, if userRepository cannot save user");
    it.todo(
      "should be error, if emailVerificationRepository cannot save emailVerified"
    );
  });
  describe("updateUser", () => {
    it("", () => {});
  });
  describe("deleteUserById", () => {
    it("", () => {});
    it("", () => {});
    it("", () => {});
    it("", () => {});
    it("", () => {});
  });
  describe("login", () => {
    it("", () => {});
    it("", () => {});
    it("", () => {});
    it("", () => {});
    it("", () => {});
  });
  describe("findUserById", () => {
    it("", () => {});
    it("", () => {});
    it("", () => {});
    it("", () => {});
    it("", () => {});
  });
});

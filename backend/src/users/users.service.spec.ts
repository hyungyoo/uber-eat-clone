import { Test } from "@nestjs/testing";
import { UsersService } from "src/users/users.service";
import { JwtService } from "src/jwt/jwt.service";
import { EmailService } from "src/email/email.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { EmailVerification } from "src/email/entities/email.verification.entity";
import { ConfigService } from "@nestjs/config";

describe("UsersService", () => {
  /**
   * les DIs dans UsersService
   */
  let usersService: UsersService;
  let jwtService: JwtService;
  let emailService: EmailService;
  let userRepository: any;
  let emailVerificationRepository: any;

  // jest.mock("src/jwt/jwt.service");
  jest.mock("src/email/email.service");
  jest.mock("@nestjs/config");

  const mockJwtService = {
    signToken: jest.fn(),
    verifyToken: jest.fn(),
  };

  const mockEmailService = {
    sendMail: jest.fn(),
    verifierMailCode: jest.fn(),
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  /**
   * mock module, service and repository
   */
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        EmailService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(EmailVerification),
          useValue: mockRepository,
        },
      ],
    }).compile();
    usersService = moduleRef.get(UsersService);
    emailService = moduleRef.get(EmailService);
    userRepository = moduleRef.get<any>(getRepositoryToken(User));
    emailVerificationRepository = moduleRef.get<any>(
      getRepositoryToken(EmailVerification)
    );
  });

  it("should be defined services and repositories", () => {
    expect(usersService).toBeDefined();
    expect(emailService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(emailVerificationRepository).toBeDefined();
  });

  /**
   * test getUsers resolver
   */
  describe("users", () => {
    it("should be success with IsOk : true", () => {});
    it("", () => {});
    it("", () => {});
  });
  describe("", () => {
    it("", () => {});
    it("", () => {});
    it("", () => {});
  });
  describe("", () => {
    it("", () => {});
    it("", () => {});
    it("", () => {});
  });
});

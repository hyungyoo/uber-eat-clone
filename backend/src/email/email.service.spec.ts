import { Test } from "@nestjs/testing";
import { EmailService } from "./email.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EmailVerification } from "./entities/email.verification.entity";
import { User } from "src/users/entities/users.entity";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import * as Mailgun from "mailgun-js";

/**
 * mock repository generator
 * @returns each mockRepository
 */
const MockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
});

/**
 * mock confige service generator
 * @returns each config service
 */
const mockConfigService = () => ({
  get: jest.fn(() => expect.any(String)),
});

/**
 * mock Mailgun
 */
jest.mock("mailgun-js", () => {
  return {
    message: jest.fn(() => {
      console.log("message ");
    }),
  };
});

// Mailgun.message();

type MockTypeRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe("EmailService", () => {
  let emailVerificationRepository: MockTypeRepository<EmailVerification>;
  let userRepository: MockTypeRepository<User>;
  let emailService: EmailService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: getRepositoryToken(EmailVerification),
          useValue: MockRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: MockRepository(),
        },
        {
          provide: ConfigService,
          useValue: mockConfigService(),
        },
      ],
    }).compile();

    emailVerificationRepository = moduleRef.get(
      getRepositoryToken(EmailVerification)
    );
    userRepository = moduleRef.get(getRepositoryToken(User));
    emailService = moduleRef.get<EmailService>(EmailService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe("sendEmail", () => {
    it("", () => {});
  });
  describe("verifierEmailCode", () => {
    it("", () => {});
  });
});

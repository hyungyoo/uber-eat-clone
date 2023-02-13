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
 * variables for testing
 */
const GET_VALUE = "fake-get-value";
const FROM = "mock";
const ID = 1;
const CODE = "fake-code";
const dummyUser = {
  id: ID,
  email: "hjyoo901112@gmail.com",
  name: "hyungyoo",
  password: "12345",
  isVerified: false,
  role: 0,
};

/**
 * mock confige service generator
 * @returns each config service
 */
const mockConfigService = () => ({
  get: jest.fn(() => GET_VALUE),
});

/**
 * mock Mailgun
 */
jest.mock("mailgun-js", () => {
  const mMailgun = {
    messages: jest.fn().mockReturnThis(),
    send: jest.fn(() => {}),
  };
  return jest.fn(() => mMailgun);
});
const mailgun = Mailgun({} as any);

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

  const sendMailArg = {
    to: "hjyoo901112@gmail.com",
    subject: "mockValue",
    template: "mockValue",
    name: "mockValue",
    code: "mockValue",
  };

  const mailGunArgs = {
    apiKey: expect.any(String),
    domain: expect.any(String),
  };

  describe("sendEmail", () => {
    it("should be fail if no data", async () => {
      (
        mailgun.messages().send as jest.MockedFunction<any>
      ).mockRejectedValueOnce(() => {
        throw new Error();
      });
      const result = await emailService.sendMail(
        sendMailArg.to,
        sendMailArg.subject,
        sendMailArg.template,
        sendMailArg.name,
        sendMailArg.code
      );
      expect(configService.get).toHaveBeenCalledTimes(3);
      expect(result).toThrowError();
      expect(mailgun.messages).toBeCalled();
    });

    it("should send mail", async () => {
      (mailgun.messages().send as jest.MockedFunction<any>).mockResolvedValue({
        id: ID,
        message: "Queued. Thank you.",
      });
      const result = await emailService.sendMail(
        sendMailArg.to,
        sendMailArg.subject,
        sendMailArg.template,
        sendMailArg.name,
        sendMailArg.code
      );
      expect(configService.get).toHaveBeenCalledTimes(3);
      expect(result).toEqual({
        id: ID,
        message: "Queued. Thank you.",
      });
      expect(mailgun.messages).toBeCalled();
    });
  });
  describe("verifierEmailCode", () => {
    it("should be fail if verification code is wrong", async () => {
      emailVerificationRepository.findOne.mockResolvedValueOnce(undefined);

      const result = await emailService.verifierEmailCode(CODE);
      expect(result).toEqual({
        isOk: false,
        errorMessage: "no corresponding code",
      });

      expect(emailVerificationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(emailVerificationRepository.findOne).toHaveBeenCalledWith({
        where: {
          verificationCode: CODE,
        },
        relations: ["user"],
      });
    });

    it("should be success", async () => {
      emailVerificationRepository.findOne.mockResolvedValue({
        id: ID,
        user: dummyUser,
      });
      userRepository.create.mockReturnValue(dummyUser);
      userRepository.save.mockResolvedValue(dummyUser);

      const result = await emailService.verifierEmailCode(CODE);
      expect(result).toEqual({ user: dummyUser });

      expect(emailVerificationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(emailVerificationRepository.findOne).toHaveBeenCalledWith({
        where: {
          verificationCode: CODE,
        },
        relations: ["user"],
      });
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(dummyUser);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(dummyUser);
      expect(emailVerificationRepository.delete).toHaveBeenCalledTimes(1);
      expect(emailVerificationRepository.delete).toHaveBeenCalledWith(ID);
    });
  });
});

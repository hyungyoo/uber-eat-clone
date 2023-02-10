import { getRepositoryToken } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { Test } from "@nestjs/testing";
import { User } from "./entities/users.entity";
import { EmailVerification } from "src/email/entities/email.verification.entity";
import { JwtService } from "src/jwt/jwt.service";
import { EmailService } from "src/email/email.service";

const mockRepository = {
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockJwtService = {
  signToken: jest.fn(),
  verifiyToken: jest.fn(),
};

const mockEmailService = {
  sendMail: jest.fn(),
  verifierEmailCode: jest.fn(),
};

describe("UsersService", () => {
  let usersService: UsersService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(EmailVerification),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  it("should be definde", () => {
    expect(usersService).toBeDefined();
  });
});

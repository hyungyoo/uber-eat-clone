import { Test } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { EmailVerification } from "src/email/entities/email.verification.entity";
import { JwtService } from "src/jwt/jwt.service";
import { EmailService } from "src/email/email.service";
import { Repository } from "typeorm";

const mockRepositorty = {
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

type mockRepository<T> = Record<keyof Repository<T>, jest.Mock>;

jest.mock("src/jwt/jwt.service");
jest.mock("src/email/email.service");

describe("UsersService", () => {
  let usersService: UsersService;
  // let usersRepository: mockRepository<User>;
  let usersRepository: typeof mockRepositorty;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        EmailService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepositorty,
        },
        {
          provide: getRepositoryToken(EmailVerification),
          useValue: mockRepositorty,
        },
      ],
    }).compile();
    usersService = moduleRef.get<UsersService>(UsersService);
    usersRepository = moduleRef.get(getRepositoryToken(User));
  });

  it("should be defined", () => {
    expect(usersService).toBeDefined();
  });

  describe("createUser", () => {
    it("should return false, if user exists", async () => {
      const result = await usersService.createUser({
        email: "test@test.com",
        name: "test",
        password: "12345",
        role: 0,
      });
      usersRepository.find.mockResolvedValue

      console.log(result);
      expect(result).toMatchObject({
        isOk: false,
      });
    });
    ////
  });
});

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
  let usersRepositor: mockRepository<User>;
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
    usersRepositor = moduleRef.get(getRepositoryToken(User));
  });

  it("should be defined", async () => {
    // expect(usersService).toBeDefined();
    // const mock = jest.fn();

    usersRepository.save.mockResolvedValue({
      email: "hello",
      name: "haha",
      emailVerified: true,
    }); 
    const result = await usersService.createUser({
      email: "helo",
      name: "name",
      password: "12345",
      role: 0,
    });
    console.log(result);
    // const ret = usersRepository.findOne.mockReturnValue("hello");
    // const rety = usersRepositor.findOne.mockReturnValue("hello");
    // let result = mock.mockReturnValue("hello");
    // // console.log(result);
    // console.log(ret);
    // console.log(rety);
    // expect(ret).toBeDefined();
    // expect(returna).toMatch("hello");
  });

  // describe("createUser", () => {
  //   it("should return false, if user exists", async () => {
  //     const result = await usersService.createUser({
  //       email: "test@test.com",
  //       name: "test",
  //       password: "12345",
  //       role: 0,
  //     });
  //     usersRepository.find.mockResolvedValue;

  //     // console.log(result);
  //     expect(result).toMatchObject({
  //       isOk: false,
  //     });
  // });

  ////
  // });
});

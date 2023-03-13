import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { DataSource, Repository } from "typeorm";
import * as request from "supertest";
import { User } from "src/users/entities/users.entity";
import { EmailVerification } from "src/email/entities/email.verification.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JWT } from "src/jwt/consts/jwt.consts";
import { AllowedUserRole } from "src/core/enums/user.enum";

/**
 * for mocking mailgun
 */
jest.mock("mailgun-js", () => {
  const mMailgun = {
    messages: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  return jest.fn(() => mMailgun);
});

/**
 * url
 */
const URL = "/graphql";

/**
 * User resolver testing e2e
 */
describe("Uber-eat backend (e2e)", () => {
  let app: INestApplication;

  /**
   * repositorty for get data
   */
  let userRepository: Repository<User>;
  let emailVerificationRepository: Repository<EmailVerification>;

  /**
   * setting before test
   * get app, userRepository and emailVerificationRepository from moduleRef
   * app initial
   */
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    await userRepository.save(
      userRepository.create({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: AllowedUserRole.ADMIN,
      })
    );
    await app.init();
    emailVerificationRepository = moduleRef.get<Repository<EmailVerification>>(
      getRepositoryToken(EmailVerification)
    );
  });

  /**
   *
   * @returns
   */
  const coreRequest = () => {
    return request(app.getHttpServer()).post(URL);
  };
  const postRequest = (query: string, jwtToken?: string | undefined) => {
    return jwtToken
      ? coreRequest().set(JWT, jwtToken).send({ query })
      : coreRequest().send({ query });
  };

  /**
   *
   */
  afterAll(async () => {
    const dataSource = new DataSource({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    });
    const connection = await dataSource.initialize();
    await connection.dropDatabase();
    await connection.destroy();
    app.close();
  });
});

import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { DataSource } from "typeorm";
import * as request from "supertest";

/**
 * for mocking mailgun
 */
jest.mock("mailgun-js", () => {
  const mMailgun = {
    messages: jest.fn().mockReturnThis(),
    send: jest.fn(() => {}),
  };
  return jest.fn(() => mMailgun);
});

/**
 * test e2e
 */
describe("UsersService (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  /**
   * for drop the database,
   * and close app after e2e test
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

  describe("createUser", () => {
    it("should create user", () => {
      return request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: `mutation {
          createUser(
            input: {
              name: "test"
              email: "hjyoo912112@gmail.com"
              password: "12345"
              role: CLIENT
            }
          ) {
            isOk
            errorMessage
            emailVerified {
              id
              verificationCode
              user {
                id
                email
                name
                role
              }
            }
          }
        }
        `,
        })
        .expect((res) => {
          // console.log(res);
        });
    });
  });
  it.todo("verifierEmailCode");
  it.todo("users");
  it.todo("user");
  it.todo("myProfile");
  it.todo("login");
  it.todo("updateUser");
  it.todo("deleteUser");
});

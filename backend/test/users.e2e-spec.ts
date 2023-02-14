import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { getConnection } from "typeorm";

describe("UsersService (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  it.todo("verifierEmailCode");
  it.todo("users");
  it.todo("user");
  it.todo("myProfile");
  it.todo("login");
  it.todo("createUser");
  it.todo("updateUser");
  it.todo("deleteUser");
});

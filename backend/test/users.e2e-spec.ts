import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { DataSource, Repository } from "typeorm";
import * as request from "supertest";
import { User } from "src/users/entities/users.entity";
import { EmailVerification } from "src/email/entities/email.verification.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JWT } from "src/jwt/consts/jwt.consts";

/**
 * for mocking mailgun
 */
jest.mock("mailgun-js", () => {
  const mMailgun = {
    messages: jest.fn().mockReturnThis(),
    send: jest.fn(() => "mock test send mail fn"),
  };
  return jest.fn(() => mMailgun);
});

/**
 * url
 */
const URL = "/graphql";

/**
 * dummy for test
 */
const dummy = {
  id: 1,
  email: "dummy@test.com",
  password: "12345",
  name: "dummy",
  role: "CLIENT",
};

const TOKEN__INCORRECT = "token-incorrect";

const dummyForUpdate = {
  email: "dummyChanged@test.com",
  password: "54321",
  name: "dummyChanged",
};

/**
 * User resolver testing e2e
 */
describe("Users resolver test (e2e)", () => {
  let app: INestApplication;

  /**
   * repositorty for get data
   */
  let userRepository: Repository<User>;
  let emailVerificationRepository: Repository<EmailVerification>;
  let jwtToken: string;
  /**
   * funtion for request
   * @param query query for send
   * @returns request result
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
   * setting before test
   * get app, userRepository and emailVerificationRepository from moduleRef
   * app initial
   */
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    emailVerificationRepository = moduleRef.get<Repository<EmailVerification>>(
      getRepositoryToken(EmailVerification)
    );
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
    const gqlQeury = `
      mutation {
        createUser(
          input: {
            name: "${dummy.name}",
            email: "${dummy.email}"
            password: "${dummy.password}"
          role: ${dummy.role}
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
    `;
    it("should create user", async () => {
      return postRequest(gqlQeury)
        .expect(200)
        .expect(async (res) => {
          const {
            body: {
              data: {
                createUser: { isOk, errorMessage, emailVerified },
              },
            },
          } = res;
          expect(isOk).toBeTruthy();
          expect(errorMessage).toBeNull();
          expect(emailVerified.user.email).toBe(dummy.email);
          expect(emailVerified.user.name).toBe(dummy.name);
          expect(emailVerified.user.role).toBe(dummy.role);
          expect(emailVerified.verificationCode).toBeDefined();
        });
    });
    it("should fail create user with email exists", async () => {
      return postRequest(gqlQeury)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                createUser: { isOk, errorMessage, emailVerified },
              },
            },
          } = res;
          expect(isOk).toBeFalsy();
          expect(errorMessage).toBe("this email already exists");
          expect(emailVerified).toBeNull();
        });
    });
  });

  describe("login", () => {
    const gqlQeury = (
      email: string = dummy.email,
      password: string = dummy.password
    ) => {
      return `
      {
          login(input: {
            email: "${email}"
        password: "${password}"
      }) {
        isOk
        errorMessage
        token
      }
    }`;
    };
    it("should be fail if email not exist", () => {
      return postRequest(gqlQeury("email@not.found"))
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                login: { isOk, errorMessage, token },
              },
            },
          } = res;
          expect(isOk).toBeFalsy();
          expect(errorMessage).toBe("user not exists with this email");
          expect(token).toBeNull();
        });
    });
    it("should be fail if password incorrect", () => {
      return postRequest(gqlQeury(undefined, "wrongPW"))
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                login: { isOk, errorMessage, token },
              },
            },
          } = res;
          expect(isOk).toBeFalsy();
          expect(errorMessage).toBe("password not correct");
          expect(token).toBeNull();
        });
    });
    it("should succeed and return token", () => {
      return postRequest(gqlQeury())
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                login: { isOk, errorMessage, token },
              },
            },
          } = res;
          expect(isOk).toBeTruthy();
          expect(errorMessage).toBeNull();
          expect(token).toBeDefined();
        })
        .then((res) => {
          jwtToken = res.body.data.login.token;
        });
    });
  });

  describe("users", () => {
    const gqlQeury = `
    {
      users {
        isOk
        errorMessage
        users {
          name
          email
          id
          role
        }
      }
    }`;
    it(`should get user email name is ${dummy.email}`, () => {
      return postRequest(gqlQeury, jwtToken)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                users: { isOk, errorMessage, users },
              },
            },
          } = res;
          expect(isOk).toBeTruthy();
          expect(errorMessage).toBeNull();
          const [user] = users;
          expect(user.email).toBe(dummy.email);
          expect(user.name).toBe(dummy.name);
          expect(user.role).toBe(dummy.role);
        });
    });
  });

  describe("user", () => {
    const gqlQeury = (userId: number) => {
      return `
    {
      user (input: {id : ${userId}}) {
        isOk
        errorMessage
        user{
          id
          name
          email
        }
      }
    }`;
    };
    it("should be fail if user id not exists", () => {
      return postRequest(gqlQeury(5), jwtToken)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                user: { isOk, errorMessage, user },
              },
            },
          } = res;
          expect(isOk).toBeFalsy();
          expect(errorMessage).toBe("user not found");
          expect(user).toBeNull();
        });
    });
    it("should succeed", async () => {
      const [User] = await userRepository.find({
        where: { email: dummy.email },
      });
      return postRequest(gqlQeury(User.id), jwtToken)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                user: { isOk, errorMessage, user },
              },
            },
          } = res;
          expect(isOk).toBeTruthy();
          expect(errorMessage).toBeNull();
          expect(user.id).toBe(User.id);
        });
    });
  });

  describe("myProfile", () => {
    const gqlQeury = `
        {
          myProfile {
            id
            name
            email
          }
        }
      `;
    it("should be fail if jwt token is incorrect", () => {
      return postRequest(gqlQeury, TOKEN__INCORRECT)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              errors: [messages],
              data,
            },
          } = res;
          expect(data).toBeNull();
          expect(messages.message).toBe("Forbidden resource");
        });
    });
    it("should succeed", async () => {
      return postRequest(gqlQeury, jwtToken)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                myProfile: { id, name, email },
              },
            },
          } = res;
          expect(email).toBe(dummy.email);
          expect(name).toBe(dummy.name);
        });
    });
  });

  describe("updateUser", () => {
    const gqlQeury = `
      mutation {
        updateUser(input: {
          name: "${dummyForUpdate.name}", 
          email: "${dummyForUpdate.email}", 
          password: "${dummyForUpdate.password}"}) {
          isOk
          errorMessage
          user {
            id
            email
            name
          }
        }
      }
    `;
    it("should be fail if jwt token is incorrect", () => {
      return postRequest(gqlQeury, TOKEN__INCORRECT)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              errors: [messages],
              data,
            },
          } = res;
          expect(data).toBeNull();
          expect(messages.message).toBe("Forbidden resource");
        });
    });
    it("should update user", () => {
      return postRequest(gqlQeury, jwtToken)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                updateUser: { isOk, errorMessage, user },
              },
            },
          } = res;
          expect(isOk).toBeTruthy();
          expect(errorMessage).toBeNull();
          expect(user.email).toBe(dummyForUpdate.email);
          expect(user.name).toBe(dummyForUpdate.name);
        });
    });
  });

  describe("verifierEmailCode", () => {
    const gqlQeury = (verificationCode: string) => {
      return `
      {
        verifierEmailCode(input: {
          verificationCode: "${verificationCode}"
        }) {
          isOk
          errorMessage
          user {
            isVerified
          }
        }
      }`;
    };
    it("should fail", async () => {
      const verficationCode = "fake-verficationCode";
      return postRequest(gqlQeury(verficationCode))
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                verifierEmailCode: { isOk, errorMessage, user },
              },
            },
          } = res;
          expect(isOk).toBeFalsy();
          expect(errorMessage).toBe("no corresponding code");
          expect(user).toBeNull();
        });
    });
    it("should succeed", async () => {
      const verficationCode = await emailVerificationRepository
        .findOne({
          where: { user: { email: dummyForUpdate.email } },
        })
        .then((res) => res.verificationCode);
      return postRequest(gqlQeury(verficationCode))
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                verifierEmailCode: { isOk, errorMessage, user },
              },
            },
          } = res;
          expect(isOk).toBeTruthy();
          expect(errorMessage).toBeNull();
          expect(user.isVerified).toBeTruthy();
        });
    });
  });

  describe("deleteUser", () => {
    const gqlQeury = (id: number) => {
      return `
      mutation{
        deleteUser(input: {
          id : ${id}
        }) {
          isOk
          errorMessage
          user {
            id
          }
        }
      }
      `;
    };
    it("should be fail if user is not exists with id", () => {
      return postRequest(gqlQeury(10), jwtToken)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                deleteUser: { isOk, errorMessage, user },
              },
            },
          } = res;
          expect(isOk).toBeFalsy();
          expect(errorMessage).toBe("this user not exists");
          expect(user).toBeNull();
        });
    });
    it("should delete user by id", async () => {
      return postRequest(gqlQeury(dummy.id), jwtToken)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                deleteUser: { isOk, errorMessage, user },
              },
            },
          } = res;
          expect(isOk).toBeTruthy();
          expect(errorMessage).toBeNull();
          expect(user.id).toBe(dummy.id);
        });
    });
  });
});

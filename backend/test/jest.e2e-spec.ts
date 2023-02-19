import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { DataSource, Repository } from "typeorm";
import * as request from "supertest";
import { User } from "src/users/entities/users.entity";
import { EmailVerification } from "src/email/entities/email.verification.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JWT } from "src/jwt/consts/jwt.consts";
import { AllowedUserRole } from "src/baseData/enums/user.enum";
import { when } from "joi";

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
 * dummy for test
 */
const dummy = {
  id: 1,
  email: "dummy@test.com",
  password: "12345",
  name: "dummy",
  role: "CLIENT",
};

const ownerDummy = {
  email: "owner@test.com",
  password: "12345",
  name: "owner",
  role: "RESTAURANT_OWNER",
};

const adminDummy = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  name: process.env.ADMIN_NAME,
  role: "ADMIN",
};

const clientDummy = {
  email: "client@test.com",
  password: "12345",
  name: "client",
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
describe("Uber-eat backend (e2e)", () => {
  let app: INestApplication;

  /**
   * repositorty for get data
   */
  let userRepository: Repository<User>;
  let emailVerificationRepository: Repository<EmailVerification>;
  let jwtToken: string;
  let jwtTokenForAdmin: string;
  let jwtTokenForClient: string;
  let jwtTokenForRestaurantOwner: string;
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
   * function for create user
   * @param name
   * @param email
   * @param password
   * @param role
   * @returns
   */
  const gqlQeuryCreateUser = (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    return `
  mutation {
    createUser(
      input: {
        name: "${name}",
        email: "${email}"
        password: "${password}"
        role: ${role}
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
  };

  /**
   * category
   */
  const category = {
    name: "category",
    categoryImg: "ategoryImg",
    description: "description",
    nameChanged: "changedName",
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

  describe("User", () => {
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

      it("should be fail create admin", () => {
        return postRequest(
          gqlQeuryCreateUser(
            adminDummy.name,
            adminDummy.email,
            adminDummy.password,
            adminDummy.role
          )
        )
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createUser.errorMessage).toBe(
              "create account with admin is not allowed"
            );
            expect(res.body.data.createUser.isOk).toBeFalsy();
          });
      });

      it("should create restaurant_owner", () => {
        return postRequest(
          gqlQeuryCreateUser(
            ownerDummy.name,
            ownerDummy.email,
            ownerDummy.password,
            ownerDummy.role
          )
        )
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createUser.isOk).toBeTruthy();
          });
      });
      it("should create ", () => {
        return postRequest(
          gqlQeuryCreateUser(
            clientDummy.name,
            clientDummy.email,
            clientDummy.password,
            clientDummy.role
          )
        )
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createUser.isOk).toBeTruthy();
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

      it("should succeed and return token for admin", () => {
        return postRequest(gqlQeury(adminDummy.email, adminDummy.password))
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
            jwtTokenForAdmin = res.body.data.login.token;
          });
      });

      it("should succeed and return token for restaurant owner", () => {
        return postRequest(gqlQeury(ownerDummy.email, ownerDummy.password))
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
            jwtTokenForRestaurantOwner = res.body.data.login.token;
          });
      });

      it("should succeed and return token for client", () => {
        return postRequest(gqlQeury(clientDummy.email, clientDummy.password))
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
            jwtTokenForClient = res.body.data.login.token;
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
      it(`should get users`, () => {
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
            expect(users).toBeDefined();
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
        return postRequest(gqlQeury(verficationCode), jwtToken)
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
        return postRequest(gqlQeury(verficationCode), jwtToken)
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
        const userEntity = await userRepository.findOne({
          where: { name: dummyForUpdate.name },
        });
        return postRequest(gqlQeury(userEntity.id), jwtToken)
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
            expect(user.id).toBe(userEntity.id);
          });
      });
    });
  });

  describe("Category", () => {
    describe("createCategory", () => {
      const gqlQeury = (name: string = category.name) => {
        return `
      mutation{
        createCategory(input: {
          name: "${name}"
          categoryImg: "${category.categoryImg}"
          description: "${category.description}"
        }) {
          isOk
          errorMessage
          category {
            name
            categoryImg
            description
          }
        }
      }`;
      };
      it("should be fail if user is not ADMIN", () => {
        return postRequest(gqlQeury(), jwtTokenForRestaurantOwner)
          .expect(200)
          .expect((res) => {
            expect(res.body.data).toBeNull();
          });
      });
      it("should be success if user is ADMIN", () => {
        return postRequest(gqlQeury(), jwtTokenForAdmin)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createCategory.isOk).toBeTruthy();
          });
      });
      it("should be success if user is ADMIN", () => {
        return postRequest(gqlQeury("categoryForDelete"), jwtTokenForAdmin)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createCategory.isOk).toBeTruthy();
          });
      });
    });
    describe("updateCategory", () => {
      const gqlQeury = (categoryName: string) => {
        return `
      mutation {
        updateCategory (input: {
          categoryName : "${categoryName}"
          name : "${category.nameChanged}"
          categoryImg :"img"
        }) {
          isOk
          errorMessage
          category {
            name
            categoryImg
          }
        }
      }`;
      };
      it("should be fail if user is not ADMIN", () => {
        return postRequest(gqlQeury(category.name), jwtTokenForClient)
          .expect(200)
          .expect((res) => {
            expect(res.body.data).toBeNull();
          });
      });
      it("should be fail if category name is not exists", () => {
        return postRequest(gqlQeury("fake-name"), jwtTokenForAdmin)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.updateCategory.isOk).toBeFalsy();
          });
      });
      it("should be success if user is ADMIN", () => {
        return postRequest(gqlQeury(category.name), jwtTokenForAdmin)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.updateCategory.isOk).toBeTruthy();
            expect(res.body.data.updateCategory.category.name).toBe(
              category.nameChanged
            );
          });
      });
    });
    describe("category", () => {
      const gqlQeury = (categoryName: string) => {
        return `{  
          category(input: {name : "${categoryName}"}) {
            isOk
            errorMessage
            category {
              name
            }
          }
        }`;
      };
      it("should not return category if name do not exists", () => {
        return postRequest(gqlQeury("fakename"))
          .expect(200)
          .expect((res) => {
            expect(res.body.data.category.isOk).toBeFalsy();
          });
      });
      it("should return category", () => {
        return postRequest(gqlQeury(category.nameChanged))
          .expect(200)
          .expect((res) => {
            expect(res.body.data.category.isOk).toBeTruthy();
            expect(res.body.data.category.category).toBeDefined();
          });
      });
    });

    describe("categories", () => {
      const gqlQeury = `
      {
        categories {
          isOk
          errorMessage
          categories {
            name   
          }
        }
      }`;
      it("should return categories", () => {
        return postRequest(gqlQeury)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.categories.isOk).toBeTruthy();
          });
      });
    });
    describe("deleteCategory", () => {
      const gqlQeury = `
        mutation{
          deleteCategory(input: {name : "categoryForDelete"}) {
            isOk
            errorMessage
            category{
              name
            }
          }
        }
      `;
      it("should be fail for delete category by restaurant owner", () => {
        return postRequest(gqlQeury, jwtTokenForRestaurantOwner)
          .expect(200)
          .expect((res) => {
            expect(res.body.data).toBeNull();
          });
      });
      it("should delete category", () => {
        return postRequest(gqlQeury, jwtTokenForAdmin)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.deleteCategory.isOk).toBeTruthy();
          });
      });
    });
  });

  /**
   * // 다시 받아야함
 *   { name: 'admin', email: 'admin@test.com', id: 2, role: 'ADMIN' },
      {
        name: 'owner',
        email: 'owner@test.com',
        id: 3,
        role: 'RESTAURANT_OWNER'
      },
      { name: 'client', email: 'client@test.com', id: 4, role: 'CLIENT' }
 */
  describe("Restaurant", () => {
    describe("createRestaurant", () => {
      it.todo("should be fail if user role is not restaurant owner");
      it.todo("should be success if user role is restaurant owner");
    });

    describe("updateRestaurant", () => {
      it.todo("should be fail if user role is not restaurant owner");
      it.todo("should be fail if restaurant name for change not exists");
      it.todo("should be fail if user is not owner this restaurant");
      it.todo("should be success");
    });

    describe("deleteRestaurant", () => {
      it.todo("should be fail if user role is not restaurant owner");
      it.todo("should be fail if restaurant name for delete not exists");
      it.todo("should be fail if user is not owner this restaurant");
      it.todo("should be success");
    });
  });
});

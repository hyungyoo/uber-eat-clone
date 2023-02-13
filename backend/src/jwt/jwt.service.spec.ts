import { Test } from "@nestjs/testing";
import { JwtService } from "./jwt.service";
import { ConfigService } from "@nestjs/config";
import * as Jwt from "jsonwebtoken";

/**
 * variables for testing
 */
const ID = 1;

const TOKEN = "fake-token";

const payLoad = {
  id: ID,
};

const PRIVATE_KEY = "fake-private-key";

/**
 * mock fn for dependency
 */
const mockConfigService = () => ({
  get: jest.fn(() => PRIVATE_KEY),
});

/**
 * mock jwt
 */
jest.mock("jsonwebtoken", () => {
  return {
    sign: jest.fn(() => TOKEN),
    verify: jest.fn(() => {
      return {
        id: ID,
      };
    }),
  };
});

/**
 *  unit test for JwtService
 */

describe("JwtService", () => {
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: ConfigService,
          useValue: mockConfigService(),
        },
      ],
    }).compile();

    jwtService = moduleRef.get<JwtService>(JwtService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(jwtService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe("JwtService", () => {
    describe("signToken", () => {
      it("should  return signed token", () => {
        const result = jwtService.signToken(payLoad);
        expect(result).toEqual(TOKEN);

        expect(configService.get).toHaveBeenCalledTimes(1);
        expect(configService.get).toHaveBeenCalledWith("PRIVATE_KEY_FOR_TOKEN");
        expect(Jwt.sign).toHaveBeenCalledTimes(1);
        expect(Jwt.sign).toHaveBeenCalledWith(payLoad, PRIVATE_KEY);
      });
    });

    describe("verifyToken", () => {
      it("should return id of user", async () => {
        const result = await jwtService.verifyToken(TOKEN);
        expect(result).toEqual(ID);

        expect(configService.get).toHaveBeenCalledTimes(1);
        expect(configService.get).toHaveBeenCalledWith("PRIVATE_KEY_FOR_TOKEN");
        expect(Jwt.verify).toHaveBeenCalledTimes(1);
        expect(Jwt.verify).toHaveBeenCalledWith(TOKEN, PRIVATE_KEY);
      });
    });
  });
});

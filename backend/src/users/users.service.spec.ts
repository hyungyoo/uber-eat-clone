import { UsersService } from "./users.service";
import { Test } from "@nestjs/testing";

describe("UsersService", () => {
  let UsersTestingService: UsersService;
  beforeAll(async () => {
    const UsersTestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();
    UsersTestingService = UsersTestingModule.get<UsersService>(UsersService);
  });
});

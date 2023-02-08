import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Jwt from "jsonwebtoken";

@Injectable()
export class JwtService {
  constructor(private readonly ConfigService: ConfigService) {}

  SignToken(payload: object): string {
    return Jwt.sign(payload, this.ConfigService.get("PRIVATE_KEY_FOR_TOKEN"));
  }

  VerifyToken(token: string) {
    try {
      return Jwt.verify(token, this.ConfigService.get("PRIVATE_KEY_FOR_TOKEN"))[
        "id"
      ];
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}

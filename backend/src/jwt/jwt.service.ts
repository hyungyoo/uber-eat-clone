import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Jwt from "jsonwebtoken";

@Injectable()
export class JwtService {
  constructor(private readonly ConfigService: ConfigService) {}

  signToken(payload: object): string {
    return Jwt.sign(payload, this.ConfigService.get("PRIVATE_KEY_FOR_TOKEN"));
  }

  verifyToken(token: string) {
    const returnVerify = Jwt.verify(
      token,
      this.ConfigService.get("PRIVATE_KEY_FOR_TOKEN")
    );
    console.log(returnVerify);
    // return true;
  }
}

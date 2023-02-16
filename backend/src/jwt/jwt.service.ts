import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Jwt from "jsonwebtoken";

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {
    console.log("constructor jwt service called");
  }

  signToken(payload: object): string {
    return Jwt.sign(payload, this.configService.get("PRIVATE_KEY_FOR_TOKEN"));
  }

  verifyToken(token: string) {
    return Jwt.verify(token, this.configService.get("PRIVATE_KEY_FOR_TOKEN"))[
      "id"
    ];
  }
}

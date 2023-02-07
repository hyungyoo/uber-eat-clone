import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { JwtService } from "./jwt.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
  constructor(
    private readonly JwtService: JwtService,
    private readonly UserService: UsersService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if ("jwt" in req.headers) {
        const userId = await this.JwtService.verifyToken(
          req.headers["jwt"].toString()
        );
        const user = await this.UserService.FindUserById(userId);
        req["user"] = user;
      }
    } catch (e) {
      console.log(e, " [in JwtMiddleWare]");
    }
    next();
  }
}

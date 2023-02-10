import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "src/users/users.service";
import { JwtService } from "./jwt.service";

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
  constructor(
    private readonly UsersService: UsersService,
    private readonly JwtService: JwtService
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if ("jwt" in req.headers) {
        const id = this.JwtService.verifyToken(req.headers.jwt.toString());
        const { user, errorMessage } = await this.UsersService.findUserById(id);
        if (errorMessage) throw Error();
        req["user"] = user;
      }
    } catch (e) {}
    next();
  }
}

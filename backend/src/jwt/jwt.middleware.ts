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
    console.log(" i am in user in jwt middleware")
    try {
      if ("jwt" in req.headers) {
        const id = this.JwtService.VerifyToken(req.headers["jwt"].toString());
        const userInfo = await this.UsersService.FindUserById(id);
        req["user"] = userInfo;
      }
      next();
    } catch (e) {
      console.log(e);
    }
  }
}

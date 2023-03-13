import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "src/users/users.service";
import { JwtService } from "./jwt.service";
import { JWT } from "./consts/jwt.consts";

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
  constructor(
    private readonly UsersService: UsersService,
    private readonly JwtService: JwtService
  ) {}

  /**
   *
   * @param req
   * @param _
   * @param next
   */
  async use(req: Request, _: Response, next: NextFunction) {
    try {
      if (JWT in req.headers) {
        const idFromJwt: number = await this.JwtService.verifyToken(
          req.headers.jwt.toString()
        );
        if (!idFromJwt) throw "fail to get id from jwt";
        const { user, error } = await this.UsersService.findUserById({
          id: idFromJwt,
        });
        if (error) throw error;
        req["user"] = user;
      }
    } catch (error) {
      console.log(error);
    }
    next();
  }
}

import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { JwtService } from "./jwt.service";

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
  constructor(private readonly JwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if ("jwt-token" in req.headers) {
        const userId = await this.JwtService.verifyToken(
          req.headers["jwt-token"].toString()
        );
      }
    } catch (e) {
      console.log(e, " [in JwtMiddleWare]");
    }
    next();
  }
}

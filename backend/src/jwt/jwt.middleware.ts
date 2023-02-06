import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { JwtService } from "./jwt.service";

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
  constructor(private readonly JwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const jwtToken = req.headers["jwt-token"];
    if (jwtToken) {
      this.JwtService.verifyToken(jwtToken.toString());
    }
    next();
  }
}

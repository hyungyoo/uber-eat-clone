import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { UsersResolver } from "./users.resolver";
import { UsersService } from "./users.service";
import { ConfigService } from "@nestjs/config";
import { EmailVerification } from "src/email/entities/email.verification.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailVerification])],
  providers: [UsersResolver, UsersService, ConfigService],
  exports: [UsersService],
})
export class UsersModule {
  constructor() {
    console.log("constuctor user module called");
  }
}

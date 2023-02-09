import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailResolver } from "./email.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/users.entity";
import { EmailVerification } from "./entities/email.verification.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailVerification])],
  providers: [EmailResolver, EmailService],
  exports: [EmailService],
})
export class EmailModule {}

import { DynamicModule, Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailResolver } from "./email.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/users.entity";
import { EmailVerification } from "./entities/email.verification.entity";
import { EmailModuleOptions } from "./options/email.options";

@Module({})
export class EmailModule {
  static forRoot(options: EmailModuleOptions): DynamicModule {
    return {
      global: Boolean(options.isGlobal),
      module: EmailModule,
      imports: [TypeOrmModule.forFeature([User, EmailVerification])],
      providers: [EmailResolver, EmailService],
      exports: [EmailService],
    };
  }
}

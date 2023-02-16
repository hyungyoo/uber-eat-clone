import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { AllowedUserRole } from "src/baseData/enums/user.enum";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {
  constructor() {
    console.log("constructor auth module called");
  }
}

import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "./jwt.options";
import { JwtService } from "./jwt.service";

@Module({})
export class JwtModule {
  static forRoot(options?: JwtModuleOptions): DynamicModule {
    return {
      global: options.isGlobal ? true : false,
      module: JwtModule,
      providers: [JwtService, ConfigService],
      exports: [JwtService],
    };
  }
}

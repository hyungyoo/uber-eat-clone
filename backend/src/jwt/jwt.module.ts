import { DynamicModule, Module } from "@nestjs/common";
import { JwtService } from "./jwt.service";
import { JwtModuleOptions } from "./interfaces/jwt.options.interface";

@Module({})
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      global: options.isGlobal,
      module: JwtModule,
      providers: [JwtService],
      exports: [JwtService],
    };
  }
}

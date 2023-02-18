import { Module } from "@nestjs/common";
import { CategoryRepository } from "./repositories/category.custom.respository";
import { CategoryService } from "./category.service";
import { TypeOrmExModule } from "src/baseData/typeorm-ex.module";
import { CategoryResolver } from "./category.resolver";

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CategoryRepository])],
  providers: [CategoryResolver, CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}

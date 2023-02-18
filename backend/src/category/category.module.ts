import { Module } from "@nestjs/common";
import { CategoryRepository } from "./repositories/category.custom.respository";
import { CategoryService } from "./category.service";
import { TypeOrmExModule } from "src/baseData/typeorm-ex.module";

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CategoryRepository]),],
  providers: [CategoryRepository, CategoryService],
})
export class CategoryModule {}

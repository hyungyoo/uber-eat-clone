import { CustomRepository } from "src/baseData/decorators/typeorm-ex.decorator";
import { Category } from "../entities/category.entity";
import { Repository } from "typeorm";

@CustomRepository(Category)
export class CategoryRepository extends Repository<Category> {

}

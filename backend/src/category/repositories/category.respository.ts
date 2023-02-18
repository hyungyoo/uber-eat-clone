import { CustomRepository } from "src/baseData/decorators/typeorm-ex.decorator";
import { Category } from "../entities/category.entity";
import { Repository } from "typeorm";

@CustomRepository(Category)
export class CategoryRepository extends Repository<Category> {
  /**
   * check existence of category
   * @param name
   * @returns category
   */
  isCategoryExists(CategoryName: string): Promise<Category> {
    return this.findOne({
      where: { name: CategoryName },
    });
  }
}

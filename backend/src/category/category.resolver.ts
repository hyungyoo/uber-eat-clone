import { Mutation, Resolver } from "@nestjs/graphql";
import { Category } from "./entities/category.entity";
import { CategoryService } from "./category.service";
import { UserRole } from "src/auth/decorators/roles.decorator";

@Resolver((of) => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation((returns) => Category)
  @UserRole(["ADMIN"])
  async createCategory() {
    return this.categoryService.createCategoy();
  }

  @Mutation((returns) => Category)
  @UserRole(["ADMIN"])
  async deleteCategory() {
    return this.categoryService.deleteCategoy();
  }
}

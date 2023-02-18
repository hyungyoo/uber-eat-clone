import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Category } from "./entities/category.entity";
import { CategoryService } from "./category.service";
import { UserRole } from "src/auth/decorators/roles.decorator";
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from "./dtos/create-category.dto";
import { INPUT_ARG } from "src/baseData/consts/base.consts";
import {
  UpdateCategoryInput,
  UpdateCategoryOutput,
} from "./dtos/update-category.dto";
import {
  DeleteCategoryInput,
  DeleteCategoryOutput,
} from "./dtos/delete-category.dto";
import {
  CategoriesOutput,
  CategoryInput,
  CategoryOutput,
} from "./dtos/get-category.dto";

@Resolver((of) => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation((returns) => CreateCategoryOutput)
  @UserRole(["ADMIN"])
  async createCategory(
    @Args(INPUT_ARG) createCategoryInput: CreateCategoryInput
  ) {
    return this.categoryService.createCategoy(createCategoryInput);
  }

  @Mutation((returns) => UpdateCategoryOutput)
  @UserRole(["ADMIN"])
  async updateCategory(
    @Args(INPUT_ARG) updateCategoryInput: UpdateCategoryInput
  ) {
    return this.categoryService.updateCategory(updateCategoryInput);
  }

  @Mutation((returns) => DeleteCategoryOutput)
  @UserRole(["ADMIN"])
  async deleteCategory(@Args(INPUT_ARG) { name }: DeleteCategoryInput) {
    return this.categoryService.deleteCategoy(name);
  }

  @Query((returns) => CategoryOutput)
  async category(@Args(INPUT_ARG) { name }: CategoryInput) {
    return this.categoryService.category(name);
  }

  @Query((returns) => CategoriesOutput)
  async categories() {
    return this.categoryService.categories();
  }
}

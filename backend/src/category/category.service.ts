import { Injectable } from "@nestjs/common";
import { CategoryRepository } from "./repositories/category.custom.respository";
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from "./dtos/create-category.dto";
import {
  UpdateCategoryInput,
  UpdateCategoryOutput,
} from "./dtos/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategoy(
    createCategoryInput: CreateCategoryInput
  ): Promise<CreateCategoryOutput> {
    try {
      const isCategoryExists = await this.categoryRepository.findOne({
        where: { name: createCategoryInput.name },
      });
      if (isCategoryExists) throw "category is already exists";
      const newCategory = await this.categoryRepository.save(
        this.categoryRepository.create({ ...createCategoryInput })
      );
      return {
        category: newCategory,
      };
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
    }
  }

  async updateCategory({
    name,
    description,
    categoryImg,
    categoryName,
  }: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    try {
      const categoryEntity = await this.categoryRepository.findOne({
        where: { name: categoryName },
      });
      if (!categoryEntity) throw "category not exists";
      if (name) {
        const isCategoryNameExists = await this.categoryRepository.findOne({
          where: { name },
        });
        if (isCategoryNameExists) throw "this category name is already exists";
        categoryEntity.name = name;
      }
      if (description) categoryEntity.description = description;
      if (categoryImg) categoryEntity.categoryImg = categoryImg;
      const newCategory = await this.categoryRepository.save(categoryEntity);
      return { category: newCategory };
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
    }
  }

  async deleteCategoy(name: string) {
    try {
      await this.categoryRepository.delete({ name });
    } catch (errorMessage) {}
  }
}

import { Injectable } from "@nestjs/common";
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from "./dtos/create-category.dto";
import {
  UpdateCategoryInput,
  UpdateCategoryOutput,
} from "./dtos/update-category.dto";
import { DeleteCategoryOutput } from "./dtos/delete-category.dto";
import { CategoriesOutput, CategoryOutput } from "./dtos/get-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

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

  async deleteCategoy(name: string): Promise<DeleteCategoryOutput> {
    try {
      const categoryEntity = await this.categoryRepository.findOne({
        where: { name },
      });
      if (!categoryEntity) throw "category not exists";
      await this.categoryRepository.delete({ name });
      return {
        category: categoryEntity,
      };
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
    }
  }

  async category(name: string): Promise<CategoryOutput> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { name },
      });
      if (!category) throw "category not exists";
      return {
        category,
      };
    } catch (errorMessage) {
      return {
        isOk: false,
        errorMessage,
      };
    }
  }

  async categories(): Promise<CategoriesOutput> {
    try {
      return {
        categories: await this.categoryRepository.find(),
      };
    } catch (errorMessage) {
      return {
        isOk: false,
        errorMessage,
      };
    }
  }
}

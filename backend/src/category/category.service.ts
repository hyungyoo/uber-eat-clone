import { Injectable } from "@nestjs/common";
import { CategoryRepository } from "./repositories/category.custom.respository";

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}
  async createCategoy() {}
  async deleteCategoy() {}
}

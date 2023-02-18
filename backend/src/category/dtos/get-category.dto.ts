import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { BaseOutput } from "src/baseData/base.output";
import { Category } from "../entities/category.entity";

@InputType()
export class CategoryInput extends PickType(Category, ["name"]) {}

@ObjectType()
export class CategoryOutput extends BaseOutput {
  @Field((type) => Category, { nullable: true })
  category?: Category;
}

@ObjectType()
export class CategoriesOutput extends BaseOutput {
  @Field((type) => [Category], { nullable: true })
  categories?: Category[];
}

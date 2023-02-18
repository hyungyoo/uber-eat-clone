import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { Category } from "../entities/category.entity";
import { BaseOutput } from "src/baseData/base.output";

@InputType()
export class CreateCategoryInput extends PickType(Category, [
  "name",
  "description",
  "categoryImg",
]) {}

@ObjectType()
export class CreateCategoryOutput extends BaseOutput {
  @Field((type) => Category, { nullable: true })
  category?: Category;
}

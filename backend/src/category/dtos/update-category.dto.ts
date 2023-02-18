import { Field, InputType, ObjectType, PartialType } from "@nestjs/graphql";
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from "./create-category.dto";

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {
  @Field((type) => String)
  categoryName?: string;
}

@ObjectType()
export class UpdateCategoryOutput extends CreateCategoryOutput {}

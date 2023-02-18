import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { Category } from "../entities/category.entity";
import { CreateCategoryOutput } from "./create-category.dto";

@InputType()
export class DeleteCategoryInput extends PickType(Category, ["name"]) {}

@ObjectType()
export class DeleteCategoryOutput extends CreateCategoryOutput {}

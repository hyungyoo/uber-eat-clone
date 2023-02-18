import { InputType, ObjectType, PartialType } from "@nestjs/graphql";
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from "./create-restaurant.dto";

@InputType()
export class UpdateRestaurantInput extends PartialType(CreateRestaurantInput) {}

@ObjectType()
export class UpdateRestaurantOutput extends CreateRestaurantOutput {}

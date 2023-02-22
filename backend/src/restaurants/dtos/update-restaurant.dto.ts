import { Field, InputType, ObjectType, PartialType } from "@nestjs/graphql";
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from "./create-restaurant.dto";
import { IsString } from "class-validator";

@InputType()
export class UpdateRestaurantInput extends PartialType(CreateRestaurantInput) {
  @Field((type) => Number)
  @IsString()
  restaurantId: number;
}

@ObjectType()
export class UpdateRestaurantOutput extends CreateRestaurantOutput {}

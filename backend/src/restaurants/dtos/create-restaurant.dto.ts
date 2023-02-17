import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { Restaurant } from "../entities/restaurant.entity";
import { BaseOutput } from "src/baseData/base.output";

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
  "name",
  "address",
  "restaurantImg",
]) {}

@ObjectType()
export class CreateRestaurantOutput extends BaseOutput {
  @Field((type) => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}

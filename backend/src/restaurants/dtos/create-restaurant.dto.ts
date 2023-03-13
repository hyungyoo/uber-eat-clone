import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { Restaurant } from "../entities/restaurant.entity";
import { BaseOutput } from "src/core/core.output";

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
  "name",
  "address",
  "restaurantImg",
  "description",
]) {
  @Field((type) => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends BaseOutput {
  @Field((type) => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}

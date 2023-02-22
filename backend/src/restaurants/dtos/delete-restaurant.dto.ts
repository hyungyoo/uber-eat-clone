import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { Restaurant } from "../entities/restaurant.entity";
import { CreateRestaurantOutput } from "./create-restaurant.dto";

@InputType()
export class DeleteRestaurantInput extends PickType(Restaurant, ["id"]) {}

@ObjectType()
export class DeleteRestaurantOutput extends CreateRestaurantOutput {}

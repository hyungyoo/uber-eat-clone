import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantService } from "./restaurants.service";
import { UserRole } from "src/auth/decorators/roles.decorator";
import { INPUT_ARG } from "src/baseData/consts/base.consts";
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from "./dtos/create-restaurant.dto";
import { AuthUser } from "src/auth/decorators/auth-user.decorator";
import { User } from "src/users/entities/users.entity";

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  // @Query((returns) => Restaurant)
  // @UserRole(["USER"])
  // restaurant() {
  //   return;
  // }

  // @Query((returns) => [Restaurant])
  // @UserRole(["USER"])
  // restaurants() {
  //   return { isOk: true };
  // }

  @Mutation((returns) => CreateRestaurantOutput)
  @UserRole(["RESTAURANT_OWNER"])
  async createRestaurant(
    @AuthUser() owner: User,
    @Args(INPUT_ARG) createRestaurantInput: CreateRestaurantInput
  ) {
    return this.restaurantService.createRestaurant(
      owner,
      createRestaurantInput
    );
  }
}

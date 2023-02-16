import { Mutation, Query, Resolver } from "@nestjs/graphql";
import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantService } from "./restaurants.service";
import { UserRole } from "src/auth/decorators/roles.decorator";

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {
    console.log("constructor restarurant resovler called");
  }

  @Query((returns) => Restaurant)
  @UserRole("USER")
  restaurant() {
    return;
  }

  @Query((returns) => [Restaurant])
  @UserRole("RESTAURANT_OWNER")
  restaurants() {
    return;
  }

  @Mutation((returns) => Restaurant)
  @UserRole("RESTAURANT_OWNER")
  createRestaurant() {
    return { isOk: "haha" };
  }
}

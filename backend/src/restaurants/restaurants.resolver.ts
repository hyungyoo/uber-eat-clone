import { Mutation, Query, Resolver } from "@nestjs/graphql";
import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantService } from "./restaurants.service";
import { UserRole } from "src/auth/decorators/roles.decorator";

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Query((returns) => Restaurant)
  @UserRole(["RESTAURANT_OWNER"])
  restaurant() {
    return;
  }

  @Query((returns) => [Restaurant])
  @UserRole(["RESTAURANT_OWNER"])
  restaurants() {
    return;
  }

  @Mutation((returns) => Restaurant)
  @UserRole(["RESTAURANT_OWNER"])
  createRestaurant() {
    return;
  }
}

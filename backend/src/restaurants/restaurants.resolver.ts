import { Query, Resolver } from "@nestjs/graphql";
import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantService } from "./restaurants.service";

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {
    console.log("constructor restarurant resovler called");
  }

  @Query((returns) => Restaurant)
  restaurant() {
    return;
  }

  @Query((returns) => [Restaurant])
  restaurants() {
    return;
  }
}

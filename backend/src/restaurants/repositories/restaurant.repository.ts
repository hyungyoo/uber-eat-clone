import { CustomRepository } from "src/baseData/decorators/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { Restaurant } from "../entities/restaurant.entity";

@CustomRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {
  /**
   * check existence of restaurant
   * @param name
   * @returns restaurant
   */
  isRestaurantExists(name: string): Promise<Restaurant> {
    return this.findOne({
      where: { name },
    });
  }

  async canAccessToRestaurant(name: string, userId: number) {
    try {
      const restaurant = await this.isRestaurantExists(name);
      if (restaurant && restaurant.ownerId === userId) return restaurant;
      else throw "no right for restaurant";
    } catch (errorMessage) {
      console.log(errorMessage);
      return undefined;
    }
  }
}

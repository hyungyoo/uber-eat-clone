import { CustomRepository } from "src/core/decorators/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { Restaurant } from "../entities/restaurant.entity";

@CustomRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {
  /**
   * check existence of restaurant
   * @param name
   * @returns restaurant
   */
  // isRestaurantExists(name: string): Promise<Restaurant> {
  //   return this.findOne({
  //     where: { name },
  //   });
  // }

  async canAccessToRestaurant(restaurantId: number, userId: number) {
    try {
      const restaurant = await this.findOne({ where: { id: restaurantId } });
      if (!restaurant || restaurant.ownerId !== userId) return undefined;
      return restaurant;
    } catch {
      return undefined;
    }
  }
}

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

  async hasRightForRestaurant(name: string, userId: number): Promise<Boolean> {
    try {
      const restaurant = await this.isRestaurantExists(name);
      return restaurant && restaurant.ownerId === userId;
    } catch (errorMessage) {
      console.log(errorMessage);
      return false;
    }
  }
}

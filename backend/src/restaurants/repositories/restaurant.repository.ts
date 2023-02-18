import { CustomRepository } from "src/baseData/decorators/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { Restaurant } from "../entities/restaurant.entity";

@CustomRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {}

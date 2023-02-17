import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { Repository } from "typeorm";
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from "./dtos/create-restaurant.dto";
import { User } from "src/users/entities/users.entity";
import { CategoryRepository } from "./repositories/category.custom.respository";

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly categoryRepository: CategoryRepository
  ) {}

  /**
   * create restaurant
   * 1. add category using categoryRepository function
   * 2. save user in restaurant
   * 3. create restaurant and save
   * @param owner user info from AuthUser decorator
   * @param createRestaurantInput info for create restaurant
   * @returns isOk, errorMessage, restaurant info
   */
  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput
  ): Promise<CreateRestaurantOutput> {
    // category.
    // mette user
    // create
    // save
    return { isOk: true, errorMessage: "haha" };
  }
}

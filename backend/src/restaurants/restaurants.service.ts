import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { Repository } from "typeorm";
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from "./dtos/create-restaurant.dto";
import { User } from "src/users/entities/users.entity";
import { Category } from "src/category/entities/category.entity";

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  /**
   * create restaurant
   * 1. add category using categoryRepository function
   * 2 - 1. save user in restaurant
   * 2 - 2. save category in restaurant
   * 3. create restaurant and save
   * @param owner user info from AuthUser decorator
   * @param createRestaurantInput info for create restaurant
   * @returns isOk, errorMessage, restaurant info
   */
  async createRestaurant(
    owner: User,
    {
      name,
      description,
      address,
      categotyName,
      restaurantImg,
    }: CreateRestaurantInput
  ): Promise<CreateRestaurantOutput> {
    try {
      const isRestaurantExists = await this.restaurantRepository.findOne({
        where: { name },
      });
      if (isRestaurantExists) throw "Restaurant is already exists";
      const category = await this.categoryRepository.findOne({
        where: { name: categotyName },
      });
      if (!category) throw "category not exists";
      const restaurant = await this.restaurantRepository.save(
        this.restaurantRepository.create({
          name,
          description,
          address,
          restaurantImg,
          category,
          owner,
        })
      );
      return {
        restaurant,
      };
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
    }
  }
}

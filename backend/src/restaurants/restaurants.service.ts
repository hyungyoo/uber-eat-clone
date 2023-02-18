import { Injectable, Res } from "@nestjs/common";
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from "./dtos/create-restaurant.dto";
import { User } from "src/users/entities/users.entity";
import {
  UpdateRestaurantInput,
  UpdateRestaurantOutput,
} from "./dtos/update-restaurant.dto";
import { RestaurantRepository } from "./repositories/restaurant.repository";
import { CategoryRepository } from "src/category/repositories/category.respository";

@Injectable()
export class RestaurantService {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly categoryRepository: CategoryRepository
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
      categoryName,
      restaurantImg,
    }: CreateRestaurantInput
  ): Promise<CreateRestaurantOutput> {
    try {
      const isRestaurantExists =
        await this.restaurantRepository.isRestaurantExists(name);
      if (isRestaurantExists) throw "Restaurant is already exists";
      const category = await this.categoryRepository.isCategoryExists(
        categoryName
      );
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

  /**
   * update restaurant
   * 1. check the right for user if user can update restaurant (user must be owner)
   * 2. check restaurant name for extence
   * 3. create restaurant entity
   * 4. save restaurant
   * @param param0 user info
   * @param param1 UpdateRestaurantInput
   * @returns UpdateRestaurantOutput
   */
  async updateRestaurant(
    userId: number,
    {
      restaurantName,
      name,
      description,
      address,
      restaurantImg,
      categoryName,
    }: UpdateRestaurantInput
  ): Promise<UpdateRestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepository.isRestaurantExists(
        restaurantName
      );
      if (!restaurant) throw "restaurant not exists";
      const hasRightForRestaurant =
        await this.restaurantRepository.hasRightForRestaurant(
          restaurantName,
          userId
        );
      if (!hasRightForRestaurant)
        throw "you do not have the right to update this restaurant";
      if (name) {
        const isRestaurantExists =
          await this.restaurantRepository.isRestaurantExists(name);
        if (isRestaurantExists) throw "restaurant name is already exists";
        restaurant.name = name;
      }
      if (description) restaurant.description = description;
      if (address) restaurant.address = address;
      if (restaurantImg) restaurant.restaurantImg = restaurantImg;
      if (categoryName) {
        const category = await this.categoryRepository.isCategoryExists(
          categoryName
        );
        if (category) restaurant.category = category;
      }
      await this.restaurantRepository.save(restaurant);
      return {
        restaurant,
      };
    } catch (errorMessage) {
      return {
        isOk: false,
        errorMessage,
      };
    }
  }
}

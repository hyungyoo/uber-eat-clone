import { Injectable } from "@nestjs/common";
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
import { DeleteRestaurantInput } from "./dtos/delete-restaurant.dto";

@Injectable()
export class RestaurantService {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  /**
   *
   * @param owner
   * @param param1
   * @returns
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
    } catch (error) {
      return { isOk: false, error };
    }
  }

  /**
   *
   * @param userId
   * @param param1
   * @returns
   */
  async updateRestaurant(
    userId: number,
    {
      restaurantId,
      name,
      description,
      address,
      restaurantImg,
      categoryName,
    }: UpdateRestaurantInput
  ): Promise<UpdateRestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepository.canAccessToRestaurant(
        restaurantId,
        userId
      );
      if (!restaurant) throw "update restaurant fail";
      if (name) restaurant.name = name;
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
    } catch (error) {
      return {
        isOk: false,
        error,
      };
    }
  }

  /**
   * 
   * @param userId 
   * @param param1 
   * @returns 
   */
  async deleteRestaurant(userId: number, { id }: DeleteRestaurantInput) {
    try {
      const restaurant = await this.restaurantRepository.canAccessToRestaurant(
        id,
        userId
      );
      if (!restaurant) throw "delete restaurant fail";
      await this.restaurantRepository.delete({ id });
      return {
        restaurant,
      };
    } catch (error) {
      return {
        isOk: false,
        error,
      };
    }
  }
}

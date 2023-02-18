import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantService } from "./restaurants.service";
import { UserRole } from "src/auth/decorators/roles.decorator";
import { INPUT_ARG } from "src/baseData/consts/base.consts";
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from "./dtos/create-restaurant.dto";
import { AuthUser } from "src/auth/decorators/auth-user.decorator";
import { User } from "src/users/entities/users.entity";
import {
  UpdateRestaurantInput,
  UpdateRestaurantOutput,
} from "./dtos/update-restaurant.dto";

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  // @Query((returns) => Restaurant)
  // @UserRole(["USER"])
  // restaurant() {
  //   return;
  // }

  // @Query((returns) => [Restaurant])
  // @UserRole(["USER"])
  // restaurants() {
  //   return { isOk: true };
  // }

  @Mutation((returns) => CreateRestaurantOutput)
  @UserRole(["RESTAURANT_OWNER"])
  async createRestaurant(
    @AuthUser() owner: User,
    @Args(INPUT_ARG) createRestaurantInput: CreateRestaurantInput
  ) {
    return this.restaurantService.createRestaurant(
      owner,
      createRestaurantInput
    );
  }

  // 레스토랑 레포지토리를 커스텀으로 만들면
  // 레스토랑 오너와 레스토랑의 오너 아이디가 같은지 확인해주는
  // 내장함수를 만들수있다?
  // 엔티티에 넣을까그냥?

  // user 얻어와서, 내 id랑 여기 id랑같은지부터 봐야한다.
  // 이거 가드로 하나만들까?
  @Mutation((returns) => UpdateRestaurantOutput)
  @UserRole(["RESTAURANT_OWNER"])
  async updateRestaurant(
    @Args(INPUT_ARG) updateRestaurantInput: UpdateRestaurantInput
  ) {
    this.restaurantService.updateRestaurant(updateRestaurantInput);
  }

  // @Mutation(returns => )
  // delete
}

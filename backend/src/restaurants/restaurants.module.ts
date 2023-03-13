import { Module } from "@nestjs/common";
import { RestaurantResolver } from "./restaurants.resolver";
import { RestaurantService } from "./restaurants.service";
import { RestaurantRepository } from "./repositories/restaurant.repository";
import { CategoryRepository } from "src/category/repositories/category.respository";
import { TypeOrmExModule } from "src/core/typeorm-ex.module";

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      RestaurantRepository,
      CategoryRepository,
    ]),
  ],
  providers: [RestaurantResolver, RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}

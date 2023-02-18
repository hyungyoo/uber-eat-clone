import { Module } from "@nestjs/common";
import { RestaurantResolver } from "./restaurants.resolver";
import { RestaurantService } from "./restaurants.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmExModule } from "src/baseData/typeorm-ex.module";
import { Category } from "src/category/entities/category.entity";
import { RestaurantRepository } from "./repositories/restaurant.repository";
import { CategoryRepository } from "src/category/repositories/category.respository";

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

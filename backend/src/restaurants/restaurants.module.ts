import { Module } from "@nestjs/common";
import { RestaurantResolver } from "./restaurants.resolver";
import { RestaurantService } from "./restaurants.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { TypeOrmExModule } from "src/baseData/typeorm-ex.module";
import { CategoryRepository } from "../category/repositories/category.custom.respository";

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  providers: [RestaurantResolver, RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}

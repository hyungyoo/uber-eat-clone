import { Module } from "@nestjs/common";
import { RestaurantResolver } from "./restaurants.resolver";
import { RestaurantService } from "./restaurants.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { TypeOrmExModule } from "src/baseData/typeorm-ex.module";
import { CategoryRepository } from "src/category/repositories/category.custom.respository";
import { Category } from "src/category/entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Category])],
  providers: [RestaurantResolver, RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}

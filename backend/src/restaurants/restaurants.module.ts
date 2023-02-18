import { Module } from "@nestjs/common";
import { RestaurantResolver } from "./restaurants.resolver";
import { RestaurantService } from "./restaurants.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmExModule } from "src/baseData/typeorm-ex.module";
import { Category } from "src/category/entities/category.entity";
import { RestaurantRepository } from "./repositories/restaurant.repository";

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([RestaurantRepository]),
    TypeOrmModule.forFeature([Category]),
  ],
  providers: [RestaurantResolver, RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}

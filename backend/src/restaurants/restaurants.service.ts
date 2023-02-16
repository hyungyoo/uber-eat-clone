import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { Repository } from "typeorm";

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant) private readonly test1: Repository<Restaurant>
  ) {
    console.log("constructor restaurant service called");
  }
}

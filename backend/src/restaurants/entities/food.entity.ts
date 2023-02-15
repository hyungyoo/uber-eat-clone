import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";
import { ParentEntity } from "src/baseData/base.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Restaurant } from "./restaurant.entity";

@ObjectType()
export class FoodChoice {
  @Field((type) => String)
  name: string;
  @Field((type) => Int, { nullable: true })
  extra?: number;
}

@ObjectType()
export class FoodOption {
  @Field((type) => String)
  name: string;
  @Field((type) => [FoodChoice], { nullable: true })
  choices?: FoodChoice[];
  @Field((type) => Int, { nullable: true })
  extra?: number;
}

@InputType("FoodInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class Food extends ParentEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  name: string;

  @Field((type) => Int)
  @Column()
  @IsNumber()
  price: number;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  foodImg: string;

  @Field((type) => String)
  @Column()
  description: string;

  @Field((type) => Restaurant)
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.menu, {
    onDelete: "CASCADE",
  })
  restaurant: Restaurant;

  @RelationId((food: Food) => food.restaurant)
  restaurantId: number;

  @Field((type) => [FoodOption], { nullable: true })
  @Column({ type: "json", nullable: true })
  options?: FoodOption[];
}

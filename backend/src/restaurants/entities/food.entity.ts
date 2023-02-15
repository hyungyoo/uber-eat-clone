import { InputType, ObjectType } from "@nestjs/graphql";
import { ParentEntity } from "src/baseData/base.entity";
import { Entity } from "typeorm";

@InputType("FoodInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class Food extends ParentEntity {}
//
//
// @ObjectType()
// export class FoodChoice {
//   @Field((type) => String)
//   name: string;
//   @Field((type) => Int, { nullable: true })
//   extra?: number;
// }

// @ObjectType()
// export class FoodOption {
//   @Field((type) => String)
//   name: string;
//   @Field((type) => [FoodChoice], { nullable: true })
//   choices?: FoodChoice[];
//   @Field((type) => Int, { nullable: true })
//   extra?: number;
// }
//
//
// @Field((type) => String)
// @Column()
// @IsString()
// name: string;
// @Field((type) => Int)
// @Column()
// @IsNumber()
// price: number;
// @Field((type) => String, { nullable: true })
// @Column({ nullable: true })
// @IsString()
// foodImg: string;
// @Field((type) => String)
// @Column()
// description: string;
// @Field((type) => Restaurant)
// @ManyToOne((type) => Restaurant, (restaurant) => restaurant.menu, {
//   onDelete: "CASCADE",
// })
// restaurant: Restaurant;
// @RelationId((food: Food) => food.restaurant)
// restaurantId: number;
// @Field((type) => [FoodOption], { nullable: true })
// @Column({ type: "json", nullable: true })
// options?: FoodOption[];

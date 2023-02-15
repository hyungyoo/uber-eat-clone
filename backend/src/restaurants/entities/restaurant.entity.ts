import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { ParentEntity } from "src/baseData/base.entity";
import { Column, Entity } from "typeorm";

@ObjectType()
@Entity()
export class Restaurant extends ParentEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  address: string;

  @Field((type) => String)
  @Column()
  @IsString()
  restaurantImg: string;
}

// @Field((type) => Category, { nullable: true })
// @ManyToOne((type) => Category, (category) => category.restaurants, {
//   nullable: true,
//   onDelete: "SET NULL",
//   eager: true,
// })
// category: Category;

// @Field((type) => User)
// @ManyToOne((type) => User, (user) => user.restaurants, {
//   onDelete: "CASCADE",
// })
// owner: User;

// @RelationId((restaurant: Restaurant) => restaurant.owner)
// ownerId: number;

// @Field((type) => [Order])
// @OneToMany((type) => Order, (order) => order.restaurant)
// orders: Order[];

// @Field((type) => [Food])
// @OneToMany((type) => Food, (food) => food.restaurant)
// menu: Food[];

// @Field((type) => Boolean)
// @Column({ default: false })
// isPromoted: boolean;

// @Field((type) => Date, { nullable: true })
// @Column({ nullable: true })
// promotedUntil: Date;

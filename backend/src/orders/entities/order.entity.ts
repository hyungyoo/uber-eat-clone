import { Field, Float, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsEnum, IsNumber } from "class-validator";
import { ParentEntity } from "src/baseData/base.entity";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { User } from "src/users/entities/users.entity";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from "typeorm";
import { OrderFood } from "./order.food.option.entity";

export enum OrderStatus {
  Waiting = "waiting",
  Cooking = "Cooking",
  Cooked = "Cooked",
  PickedUp = "PickedUp",
  Delivered = "Delivered",
}

registerEnumType(OrderStatus, { name: "OrderStatus" });

@ObjectType()
@Entity()
export class Order extends ParentEntity {
  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.orders, {
    onDelete: "SET NULL",
    nullable: true,
    eager: true,
  })
  customer?: User;

  @RelationId((order: Order) => order.customer)
  customerId: number;

  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.rides, {
    onDelete: "SET NULL",
    nullable: true,
    eager: true,
  })
  driver?: User;

  @RelationId((order: Order) => order.driver)
  driverId: number;

  @Field((type) => Restaurant, { nullable: true })
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: "SET NULL",
    nullable: true,
    eager: true,
  })
  restaurant?: Restaurant;

  @Field((type) => [OrderFood])
  @ManyToMany((type) => OrderFood, { eager: true })
  @JoinTable()
  foods: OrderFood[];

  @Column({ nullable: true })
  @Field((type) => Float, { nullable: true })
  @IsNumber()
  total?: number;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Waiting })
  @Field((type) => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

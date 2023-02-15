import { ObjectType } from "@nestjs/graphql";
import { ParentEntity } from "src/baseData/base.entity";
import { Entity } from "typeorm";

@ObjectType()
@Entity()
export class Order extends ParentEntity {}

//
//
//
//
//
//
//

// export enum OrderStatus {
//   Waiting = "waiting",
//   Cooking = "Cooking",
//   Cooked = "Cooked",
//   PickedUp = "PickedUp",
//   Delivered = "Delivered",
// }
// registerEnumType(OrderStatus, { name: "OrderStatus" });
// @Field((type) => User, { nullable: true })
// @ManyToOne((type) => User, (user) => user.orders, {
//   onDelete: "SET NULL",
//   nullable: true,
//   eager: true,
// })
// customer?: User;
// @RelationId((order: Order) => order.customer)
// customerId: number;
// @Field((type) => User, { nullable: true })
// @ManyToOne((type) => User, (user) => user.rides, {
//   onDelete: "SET NULL",
//   nullable: true,
//   eager: true,
// })
// driver?: User;
// @RelationId((order: Order) => order.driver)
// driverId: number;
// @Field((type) => Restaurant, { nullable: true })
// @ManyToOne((type) => Restaurant, (restaurant) => restaurant.orders, {
//   onDelete: "SET NULL",
//   nullable: true,
//   eager: true,
// })
// restaurant?: Restaurant;
// @Field((type) => [OrderFood])
// @ManyToMany((type) => OrderFood, { eager: true })
// @JoinTable()
// foods: OrderFood[];
// @Column({ nullable: true })
// @Field((type) => Float, { nullable: true })
// @IsNumber()
// total?: number;
// @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Waiting })
// @Field((type) => OrderStatus)
// @IsEnum(OrderStatus)
// status: OrderStatus;

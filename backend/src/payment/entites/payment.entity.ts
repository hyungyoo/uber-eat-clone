import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { ParentEntity } from "src/baseData/base.entity";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { User } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";

@InputType("PaymentInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class Payment extends ParentEntity {
  @Field((type) => String)
  @Column()
  transactionId: string;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.payments)
  user: User;

  @RelationId((payment: Payment) => payment.user)
  userId: number;

  @Field((type) => Restaurant)
  @ManyToOne((type) => Restaurant)
  restaurant: Restaurant;

  @Field((type) => Int)
  @RelationId((payment: Payment) => payment.restaurant)
  restaurantId: number;
}

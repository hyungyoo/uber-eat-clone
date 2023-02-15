import { ObjectType } from "@nestjs/graphql";
import { ParentEntity } from "src/baseData/base.entity";
import { Entity } from "typeorm";

@ObjectType()
@Entity()
export class Payment extends ParentEntity {}

// @Field((type) => String)
// @Column()
// transactionId: string;

// @Field((type) => User)
// @ManyToOne((type) => User, (user) => user.payments)
// user: User;

// @RelationId((payment: Payment) => payment.user)
// userId: number;

// @Field((type) => Restaurant)
// @ManyToOne((type) => Restaurant)
// restaurant: Restaurant;

// @Field((type) => Int)
// @RelationId((payment: Payment) => payment.restaurant)
// restaurantId: number;

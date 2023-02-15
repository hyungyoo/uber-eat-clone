import { ObjectType } from "@nestjs/graphql";
import { ParentEntity } from "src/baseData/base.entity";
import { Entity } from "typeorm";

@ObjectType()
@Entity()
export class OrderFood extends ParentEntity {}

// @ObjectType()
// export class OrderFoodOption {
//   @Field((type) => String)
//   name: string;
//   @Field((type) => String, { nullable: true })
//   choice: String;
// }

// @Field((type) => Food)
// @ManyToOne((type) => Food, { nullable: true, onDelete: "CASCADE" })
// food: Food;

// @Field((type) => [OrderFoodOption], { nullable: true })
// @Column({ type: "json", nullable: true })
// options?: OrderFoodOption[];

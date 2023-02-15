import { Field, ObjectType } from "@nestjs/graphql";
import { ParentEntity } from "src/baseData/base.entity";
import { Food } from "src/restaurants/entities/food.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@ObjectType()
export class OrderFoodOption {
  @Field((type) => String)
  name: string;
  @Field((type) => String, { nullable: true })
  choice: String;
}

@ObjectType()
@Entity()
export class OrderFood extends ParentEntity {
  @Field((type) => Food)
  @ManyToOne((type) => Food, { nullable: true, onDelete: "CASCADE" })
  food: Food;

  @Field((type) => [OrderFoodOption], { nullable: true })
  @Column({ type: "json", nullable: true })
  options?: OrderFoodOption[];
}

import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { BasedEntity } from "src/baseData/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Restaurant } from "./restaurant.entity";

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Category extends BasedEntity {
  @Field((type) => String)
  @Column({ unique: true })
  name: string;

  @Field((type) => String)
  @Column({ unique: true })
  slug: string;

  @Field((type) => String)
  @Column({ unique: true })
  categoryImg: String;

  @Field((type) => [Restaurant])
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
  restaurants: Restaurant[];
}

import { Field, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { BasedEntity } from "src/baseData/base.entity";
import { User } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Category } from "./category.entity";

@ObjectType()
@Entity()
export class Restaurant extends BasedEntity {
  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  address: string;

  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  restaurantImg: string;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.restaurants, {
    onDelete: "CASCADE",
  })
  owner: User;

  @Field((type) => Category)
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    onDelete: "SET NULL",
  })
  category: Category;

  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;

  @RelationId((resaurant: Restaurant) => resaurant.category)
  categoryId: number;
}

import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";
import { BasedEntity } from "src/baseData/base.entity";
import { User } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Category } from "../../category/entities/category.entity";

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends BasedEntity {
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

  @Field((type) => String)
  @IsString()
  @Column()
  description: string;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.restaurants, {
    onDelete: "CASCADE",
  })
  owner: User;

  @Field((type) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    onDelete: "SET NULL",
  })
  category?: Category;

  @RelationId((restaurant: Restaurant) => restaurant.owner)
  @IsNumber()
  ownerId: number;

  @RelationId((resaurant: Restaurant) => resaurant.category)
  @IsNumber()
  categoryId?: number;
}

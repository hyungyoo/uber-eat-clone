import { Field, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { ParentEntity } from "src/baseData/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Restaurant } from "./restaurant.entity";

@ObjectType()
@Entity()
export class Category extends ParentEntity {
  // @Field((type) => String)
  // @Column({ unique: true })
  // @IsString()
  // name: string;
  // @Field((type) => String, { nullable: true })
  // @Column({ nullable: true })
  // @IsString()
  // categoryImg: string;
  // @Field((type) => String)
  // @Column({ unique: true })
  // @IsString()
  // slug: string;
  // @Field((type) => [Restaurant], { nullable: true })
  // @OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
  // restaurants: Restaurant[];
}

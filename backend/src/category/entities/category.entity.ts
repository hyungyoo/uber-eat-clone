import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { BasedEntity } from "src/core/core.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Restaurant } from "../../restaurants/entities/restaurant.entity";
import { IsString } from "class-validator";

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Category extends BasedEntity {
  @Field((type) => String)
  @IsString()
  @Column({ unique: true })
  name: string;

  @Field((type) => String)
  @IsString()
  @Column()
  description: string;

  @Field((type) => String)
  @IsString()
  @Column()
  categoryImg: String;

  @Field((type) => [Restaurant])
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
  restaurants: Restaurant[];
}

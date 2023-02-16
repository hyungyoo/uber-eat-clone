import { Field, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { BasedEntity } from "src/baseData/base.entity";
import { Column, Entity } from "typeorm";

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
}

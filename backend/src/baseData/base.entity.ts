import { Field, ObjectType } from "@nestjs/graphql";
import {
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
@ObjectType()
export class baseEntity {
  @PrimaryColumn()
  @Field((type) => Number)
  id: number;

  @CreateDateColumn()
  @Field((type) => Date)
  createAt: Date;

  @UpdateDateColumn()
  @Field((type) => Date)
  updateAt: Date;
}

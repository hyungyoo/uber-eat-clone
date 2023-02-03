import { Field } from "@nestjs/graphql";
import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";

export class BaseEntity {
  @PrimaryColumn()
  @Field((returns) => String)
  id: number;

  @CreateDateColumn()
  @Field((returns) => String)
  createAt: Date;

  @UpdateDateColumn()
  @Field((returns) => String)
  updateAt: Date;
}

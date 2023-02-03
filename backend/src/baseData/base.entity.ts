import { Field, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
@ObjectType()
export class ParentEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @Field((type) => Number)
  id: number;

  @CreateDateColumn()
  @IsString()
  @Field((type) => Date)
  createAt: Date;

  @UpdateDateColumn()
  @IsString()
  @Field((type) => Date)
  updateAt: Date;
}

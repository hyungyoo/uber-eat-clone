import { Field, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
export abstract class CoreEntity {
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

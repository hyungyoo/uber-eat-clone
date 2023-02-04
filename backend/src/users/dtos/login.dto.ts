import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/users.entity";
import { basename } from "path";
import { DisplayResult } from "./user.display.result";
import { IsString } from "class-validator";

@InputType()
export class LoginDto extends PickType(User, ["email", "password"]) {}

@ObjectType()
export class LoginDisplayResult extends DisplayResult {
  @Field((type) => String, { nullable: true })
  @IsString()
  token?: string;
}

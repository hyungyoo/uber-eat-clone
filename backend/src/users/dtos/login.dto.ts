import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/users.entity";
import { IsString } from "class-validator";
import { DisplayResult } from "src/baseData/base.display.result";

@InputType()
export class LoginInput extends PickType(User, ["email", "password"]) {}

@ObjectType()
export class LoginOutput extends DisplayResult {
  @Field((type) => String, { nullable: true })
  @IsString()
  token?: string;
}

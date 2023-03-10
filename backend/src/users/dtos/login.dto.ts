import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/users.entity";
import { IsString } from "class-validator";
import { BaseOutput } from "src/core/core.output";

@InputType()
export class LoginInput extends PickType(User, ["email", "password"]) {}

@ObjectType()
export class LoginOutput extends BaseOutput {
  @Field((type) => String, { nullable: true })
  @IsString()
  token?: string;
}

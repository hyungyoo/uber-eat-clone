import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/users.entity";
import { IsString } from "class-validator";
import { CoreOutput } from "src/baseData/base.output";

@InputType()
export class LoginInput extends PickType(User, ["email", "password"]) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field((type) => String, { nullable: true })
  @IsString()
  token?: string;
}

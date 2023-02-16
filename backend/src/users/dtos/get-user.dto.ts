import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { BaseOutput } from "src/baseData/base.output";
import { User } from "../entities/users.entity";
import { UserOutputType } from "./user.result.dto";

@InputType()
export class GetUserInput extends PickType(User, ["id"]) {}

@ObjectType()
export class GetUserOutput extends BaseOutput {
  @Field((type) => UserOutputType, { nullable: true })
  user?: UserOutputType;
}

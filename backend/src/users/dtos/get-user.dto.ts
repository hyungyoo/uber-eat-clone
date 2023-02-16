import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { DisplayResult } from "src/baseData/base.display.result";
import { User } from "../entities/users.entity";
import { UserOutputType } from "./user.result.dto";

@InputType()
export class GetUserInput extends PickType(User, ["id"]) {}

@ObjectType()
export class GetUserOutput extends DisplayResult {
  @Field((type) => UserOutputType, { nullable: true })
  user?: UserOutputType;
}

import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  PickType,
} from "@nestjs/graphql";
import { DisplayResult } from "src/baseData/base.display.result";
import { UserReturnType } from "../entities/user.return.entity";
import { User } from "../entities/users.entity";

@InputType()
export class GetUserInput extends PickType(User, ["id"]) {}

@ObjectType()
export class GetUserOutput extends DisplayResult {
  @Field((type) => UserReturnType, { nullable: true })
  user?: UserReturnType;
}

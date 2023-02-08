import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  PickType,
} from "@nestjs/graphql";
import { DisplayResult } from "src/baseData/base.display.result";
import { User } from "../entities/users.entity";

@InputType()
export class GetUserInput extends PickType(User, ["id"]) {}

@ObjectType()
export class GetUserOutput extends DisplayResult {
  @Field((type) => User, { nullable: true })
  user?: User;
}
import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from "@nestjs/graphql";
import { DisplayResult } from "src/baseData/base.display.result";
import { User } from "../entities/users.entity";
import { CreateUserOutput } from "./create-user.dto";

@InputType()
export class EditUserInput extends PartialType(
  PickType(User, ["email", "password", "name"])
) {}

@ObjectType()
export class EditUserOutput extends DisplayResult {
  @Field((type) => User, { nullable: true })
  user?: User;
}

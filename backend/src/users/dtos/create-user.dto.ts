import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { DisplayResult } from "src/baseData/base.display.result";
import { UserReturnType } from "../entities/user.return.entiy";
import { User } from "../entities/users.entity";
import { GetUserOutput } from "./get-user.dto";

@InputType()
export class CreateUserInput extends PickType(User, [
  "email",
  "name",
  "password",
  "role",
]) {}

@ObjectType()
export class CreateUserOutput extends DisplayResult {
  @Field((type) => UserReturnType, { nullable: true })
  user?: UserReturnType;
}

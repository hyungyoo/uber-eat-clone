import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/baseData/base.output";
import { User } from "../entities/users.entity";
import { UserOutputType } from "./user.result.dto";

@InputType()
export class DeleteUserInput extends PickType(User, ["id"]) {}

@ObjectType()
export class DeleteUserOutput extends CoreOutput {
  @Field((type) => UserOutputType, { nullable: true })
  user?: UserOutputType;
}

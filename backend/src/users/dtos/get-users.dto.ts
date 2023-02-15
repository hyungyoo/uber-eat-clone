import { Field, ObjectType } from "@nestjs/graphql";
import { DisplayResult } from "src/baseData/base.display.result";
import { UserReturnType } from "./user.result.dto";

@ObjectType()
export class GetUsersOutput extends DisplayResult {
  @Field((type) => [UserReturnType], { nullable: true })
  users?: UserReturnType[];
}

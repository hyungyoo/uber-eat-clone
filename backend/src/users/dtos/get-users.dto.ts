import { Field, ObjectType } from "@nestjs/graphql";
import { DisplayResult } from "src/baseData/base.display.result";
import { UserOutputType } from "./user.result.dto";

@ObjectType()
export class GetUsersOutput extends DisplayResult {
  @Field((type) => [UserOutputType], { nullable: true })
  users?: UserOutputType[];
}

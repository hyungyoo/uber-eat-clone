import { Field, ObjectType } from "@nestjs/graphql";
import { DisplayResult } from "src/baseData/base.display.result";
import { UserReturnType } from "../entities/user.return.entiy";

@ObjectType()
export class GetUsersOutput extends DisplayResult {
  @Field((type) => [UserReturnType], { nullable: true })
  users?: UserReturnType[];
}

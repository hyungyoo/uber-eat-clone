import { Field, ObjectType } from "@nestjs/graphql";
import { DisplayResult } from "src/baseData/base.display.result";
import { User } from "../entities/users.entity";

@ObjectType()
export class GetUsersOutput extends DisplayResult {
  @Field((type) => [User], { nullable: true })
  users?: User[];
}

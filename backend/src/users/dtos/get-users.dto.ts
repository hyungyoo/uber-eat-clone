import { Field, ObjectType } from "@nestjs/graphql";
import { BaseOutput } from "src/core/core.output";
import { UserOutputType } from "./user.result.dto";

@ObjectType()
export class GetUsersOutput extends BaseOutput {
  @Field((type) => [UserOutputType], { nullable: true })
  users?: UserOutputType[];
}

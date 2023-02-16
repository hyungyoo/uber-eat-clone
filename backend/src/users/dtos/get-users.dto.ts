import { Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/baseData/base.output";
import { UserOutputType } from "./user.result.dto";

@ObjectType()
export class GetUsersOutput extends CoreOutput {
  @Field((type) => [UserOutputType], { nullable: true })
  users?: UserOutputType[];
}

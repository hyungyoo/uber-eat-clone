import { Field, ObjectType } from "@nestjs/graphql";
import { Content } from "src/baseData/base.entity";
import { UserRole } from "../entities/users.entity";

@ObjectType()
export class UserOutputType extends Content {
  @Field((type) => String)
  email: string;

  @Field((type) => String)
  name: string;

  @Field((type) => UserRole)
  role: UserRole;

  @Field((type) => Boolean)
  isVerified: boolean;
}

import { Field, ObjectType } from "@nestjs/graphql";
import { ParentEntity } from "src/baseData/base.entity";
import { UserRole } from "./users.entity";

@ObjectType()
export class UserReturnType extends ParentEntity {
  @Field((type) => String)
  email: string;

  @Field((type) => String)
  name: string;

  @Field((type) => UserRole)
  role: UserRole;

  @Field((type) => Boolean)
  isVerified: boolean;
}

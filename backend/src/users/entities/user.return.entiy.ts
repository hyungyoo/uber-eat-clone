import { Field, ObjectType, PickType } from "@nestjs/graphql";
import { ParentEntity } from "src/baseData/base.entity";
import { User, UserRole } from "./users.entity";

@ObjectType()
export class UserReturnType extends ParentEntity {
  @Field((type) => String)
  email: string;

  @Field((type) => String)
  name: string;

  @Field((type) => UserRole)
  role: UserRole;
}

// @ObjectType()
// export class UserReturnType extends PickType(User, ["email", "name", "role"]) {}

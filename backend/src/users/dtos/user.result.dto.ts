import { ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/users.entity";

@ObjectType()
export class UserOutputType extends PickType(
  User,
  ["email", "name", "role", "isVerified", "id"],
  ObjectType
) {}

import { InputType, PickType } from "@nestjs/graphql";
import { User } from "../entities/users.entity";

@InputType()
export class CreateUserDto extends PickType(User, [
  "email",
  "name",
  "password",
  "role",
]) {}

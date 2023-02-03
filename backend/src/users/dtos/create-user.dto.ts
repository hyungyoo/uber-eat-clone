import { InputType, PickType } from "@nestjs/graphql";
import { User } from "../entities/users.entity";

@InputType()
export class createUserDtoInput extends PickType(User, [
  "email",
  "password",
  "role",
]) {}

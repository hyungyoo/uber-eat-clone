import { InputType, PartialType, PickType } from "@nestjs/graphql";
import { User } from "../entities/users.entity";

@InputType()
export class EditUserInput extends PartialType(
  PickType(User, ["email", "password"])
) {}

import { InputType, PickType } from "@nestjs/graphql";
import { User } from "../entities/users.entity";

@InputType()
export class LoginDto extends PickType(User, ["email", "password"]) {}

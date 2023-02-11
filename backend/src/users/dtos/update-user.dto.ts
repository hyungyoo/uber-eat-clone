import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from "@nestjs/graphql";
import { DisplayResult } from "src/baseData/base.display.result";
import { UserReturnType } from "../entities/user.return.entity";
import { User } from "../entities/users.entity";
import { EmailVerification } from "src/email/entities/email.verification.entity";

@InputType()
export class UpdateUserInput extends PartialType(
  PickType(User, ["email", "password", "name"])
) {}

@ObjectType()
export class UpdateUserOutput extends DisplayResult {
  @Field((type) => UserReturnType, { nullable: true })
  user?: UserReturnType;

  @Field((type) => EmailVerification, { nullable: true })
  emailVerified?: EmailVerification;
}

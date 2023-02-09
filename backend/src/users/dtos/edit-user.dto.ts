import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from "@nestjs/graphql";
import { DisplayResult } from "src/baseData/base.display.result";
import { UserReturnType } from "../entities/user.return.entiy";
import { User } from "../entities/users.entity";
import { EmailVerification } from "src/email/entities/email.verification.entity";

@InputType()
export class EditUserInput extends PartialType(
  PickType(User, ["email", "password", "name"])
) {}

@ObjectType()
export class EditUserOutput extends DisplayResult {
  @Field((type) => UserReturnType, { nullable: true })
  user?: UserReturnType;

  @Field((type) => EmailVerification)
  emailVerified?: EmailVerification;
}

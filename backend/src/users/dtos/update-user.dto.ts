import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from "@nestjs/graphql";
import { DisplayResult } from "src/baseData/base.display.result";
import { User } from "../entities/users.entity";
import { EmailVerification } from "src/email/entities/email.verification.entity";
import { UserOutputType } from "./user.result.dto";

@InputType()
export class UpdateUserInput extends PartialType(
  PickType(User, ["email", "password", "name"])
) {}

@ObjectType()
export class UpdateUserOutput extends DisplayResult {
  @Field((type) => UserOutputType, { nullable: true })
  user?: UserOutputType;

  @Field((type) => EmailVerification, { nullable: true })
  emailVerified?: EmailVerification;
}

import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { DisplayResult } from "src/baseData/base.display.result";
import { EmailVerification } from "../entities/email.verification.entity";
import { UserReturnType } from "src/users/entities/user.return.entity";

@InputType()
export class EmailVerificationInput extends PickType(EmailVerification, [
  "verificationCode",
]) {}

@ObjectType()
export class EmailVerificationOutput extends DisplayResult {
  @Field((type) => UserReturnType, { nullable: true })
  user?: UserReturnType;
}

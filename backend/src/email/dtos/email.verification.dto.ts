import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { DisplayResult } from "src/baseData/base.display.result";
import { EmailVerification } from "../entities/email.verification.entity";
import { UserOutputType } from "src/users/dtos/user.result.dto";

@InputType()
export class EmailVerificationInput extends PickType(EmailVerification, [
  "verificationCode",
]) {}

@ObjectType()
export class EmailVerificationOutput extends DisplayResult {
  @Field((type) => UserOutputType, { nullable: true })
  user?: UserOutputType;
}

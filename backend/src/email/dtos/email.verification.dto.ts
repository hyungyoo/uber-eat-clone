import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/baseData/base.output";
import { EmailVerification } from "../entities/email.verification.entity";
import { UserOutputType } from "src/users/dtos/user.result.dto";

@InputType()
export class EmailVerificationInput extends PickType(EmailVerification, [
  "verificationCode",
]) {}

@ObjectType()
export class EmailVerificationOutput extends CoreOutput {
  @Field((type) => UserOutputType, { nullable: true })
  user?: UserOutputType;
}

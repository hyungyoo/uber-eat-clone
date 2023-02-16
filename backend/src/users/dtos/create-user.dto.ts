import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/baseData/base.output";
import { User } from "../entities/users.entity";
import { EmailVerification } from "src/email/entities/email.verification.entity";
import { UserOutputType } from "./user.result.dto";

@InputType()
export class CreateUserInput extends PickType(User, [
  "email",
  "name",
  "password",
  "role",
]) {}

@ObjectType()
export class CreateUserOutput extends CoreOutput {
  @Field((type) => UserOutputType, { nullable: true })
  user?: UserOutputType;

  @Field((type) => EmailVerification, { nullable: true })
  emailVerified?: EmailVerification;
}

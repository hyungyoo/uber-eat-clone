import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/users.entity";
import { EmailVerification } from "src/email/entities/email.verification.entity";
import { UserOutputType } from "./user.result.dto";
import { BaseOutput } from "src/core/core.output";
import { UserRoleForCreate } from "src/core/enums/user.enum";

@InputType()
export class CreateUserInput extends PickType(User, [
  "email",
  "name",
  "password",
]) {
  @Field((type) => UserRoleForCreate)
  role: UserRoleForCreate;
}

@ObjectType()
export class CreateUserOutput extends BaseOutput {
  @Field((type) => UserOutputType, { nullable: true })
  user?: UserOutputType;

  @Field((type) => EmailVerification, { nullable: true })
  emailVerified?: EmailVerification;
}

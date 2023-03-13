import { Args, Query, Resolver } from "@nestjs/graphql";
import { EmailService } from "./email.service";
import {
  EmailVerificationInput,
  EmailVerificationOutput,
} from "./dtos/email.verification.dto";
import { INPUT_ARG } from "src/core/consts/base.consts";
import { EmailVerification } from "./entities/email.verification.entity";
import { UserRole } from "src/auth/decorators/roles.decorator";

@Resolver((of) => EmailVerification)
export class EmailResolver {
  constructor(private readonly emailService: EmailService) {}

  @Query((returns) => EmailVerificationOutput)
  @UserRole(["USER"])
  verifierEmailCode(
    @Args(INPUT_ARG) { verificationCode }: EmailVerificationInput
  ) {
    return this.emailService.verifierEmailCode(verificationCode);
  }
}

import { Args, Query, Resolver } from "@nestjs/graphql";
import { EmailService } from "./email.service";
import {
  EmailVerificationInput,
  EmailVerificationOutput,
} from "./dtos/email.verification.dto";

@Resolver()
export class EmailResolver {
  constructor(private readonly EmailService: EmailService) {}

  @Query((returns) => EmailVerificationOutput)
  VerifierEmailCode(
    @Args("input") { verificationCode }: EmailVerificationInput
  ) {
    return this.EmailService.VerifierEmailCode(verificationCode);
  }
}

import { Args, Query, Resolver } from "@nestjs/graphql";
import { EmailService } from "./email.service";
import {
  EmailVerificationInput,
  EmailVerificationOutput,
} from "./dtos/email.verification.dto";

@Resolver()
export class EmailResolver {
  constructor(private readonly emailService: EmailService) {}

  @Query((returns) => EmailVerificationOutput)
  verifierEmailCode(
    @Args("input") { verificationCode }: EmailVerificationInput
  ) {
    return this.emailService.verifierEmailCode(verificationCode);
  }

  
}

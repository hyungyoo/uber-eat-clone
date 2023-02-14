import { Args, Query, Resolver } from "@nestjs/graphql";
import { EmailService } from "./email.service";
import {
  EmailVerificationInput,
  EmailVerificationOutput,
} from "./dtos/email.verification.dto";
import { INPUT_ARG } from "src/baseData/consts/base.consts";

@Resolver()
export class EmailResolver {
  constructor(private readonly emailService: EmailService) {}

  @Query((returns) => EmailVerificationOutput)
  verifierEmailCode(
    @Args(INPUT_ARG) { verificationCode }: EmailVerificationInput
  ) {
    return this.emailService.verifierEmailCode(verificationCode);
  }
}

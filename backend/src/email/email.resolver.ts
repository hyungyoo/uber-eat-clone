import { Args, Query, Resolver } from "@nestjs/graphql";
import { EmailService } from "./email.service";
import {
  EmailVerificationInput,
  EmailVerificationOutput,
} from "./dtos/email.verification.dto";
import { INPUT_ARG } from "src/baseData/consts/base.consts";
import { User } from "src/users/entities/users.entity";

@Resolver((of) => User)
export class EmailResolver {
  constructor(private readonly emailService: EmailService) {}

  @Query((returns) => EmailVerificationOutput)
  verifierEmailCode(
    @Args(INPUT_ARG) { verificationCode }: EmailVerificationInput
  ) {
    return this.emailService.verifierEmailCode(verificationCode);
  }
}

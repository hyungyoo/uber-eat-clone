import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmailVerification } from "./entities/email.verification.entity";
import { User } from "src/users/entities/users.entity";
import { EmailVerificationOutput } from "./dtos/email.verification.dto";
import { ConfigService } from "@nestjs/config";
import * as Mailgun from "mailgun-js";

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}

  /**
   * This function sends a mail to the user with its name and verification code in mailgun's templates.
   * Sandbox domains are restricted to authorized recipients only. ex) "hjyoo901112@gmail.com" in my account
   * @param to hjyoo901112@gmail.com to avoid suspending my account from mailgun.
   * @param name user name
   * @param code user code in email_verification table
   */
  async sendMail(to: string, subject: string, name: string, code: string) {
    try {
      const api_key = await this.configService.get("MAILGUN_API_KEY");
      const domain = await this.configService.get("MAILGUN_DOMAIN_NAME");
      const fromEmail = await this.configService.get("MAILGUN_FROM");
      const template = await this.configService.get("MAILGUN_TEMPLATE_NAME");
      const mailgun = Mailgun({ apiKey: api_key, domain: domain });
      const data = {
        from: `Excited User <${fromEmail}>`,
        to: "hjyoo901112@gmail.com", // to
        subject,
        template,
        "h:X-Mailgun-Variables": JSON.stringify({ name, code }),
      };
      const resultSendmail = await mailgun.messages().send(data);
      // for test message
      console.log(resultSendmail); ///////////////////////
      return resultSendmail;
    } catch (error) {
      console.log(error); //////////////////////////
      return error;
    }
  }

  /**
   * verfiy code and update user isVerified to true
   * and delete Emailverification entity
   * used in User create, update resolver
   * @param verificationCode
   * @returns
   */
  async verifierEmailCode(
    verificationCode: string
  ): Promise<EmailVerificationOutput> {
    try {
      const EmailVerificationEntity =
        await this.emailVerificationRepository.findOne({
          where: {
            verificationCode,
          },
          relations: ["user"],
        });
      if (!EmailVerificationEntity) throw "no corresponding code";
      const user = EmailVerificationEntity.user;
      user.isVerified = true;
      await this.userRepository.save(this.userRepository.create(user));
      await this.emailVerificationRepository.delete(EmailVerificationEntity.id);
      return {
        user,
      };
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
    }
  }
}

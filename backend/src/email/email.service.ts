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
    private readonly EmailVerificationRepository: Repository<EmailVerification>,
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
    private readonly ConfigService: ConfigService
  ) {
    // this.SendMail();
  }

  async SendMail() {
    const api_key = this.ConfigService.get("MAILGUN_API_KEY");
    const domain = this.ConfigService.get("MAILGUN_DOMAIN_NAME");
    const fromEmail = this.ConfigService.get("MAILGUN_FROM");
    const mailgun = Mailgun({ apiKey: api_key, domain: domain });
    const data = {
      from: `Excited User <${fromEmail}>`,
      to: "hjyoo901112@gmail.com",
      subject: "Hello",
      text: "Testing some Mailgun awesomeness!",
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    });
  }

  /**
   * verfiy code and update user isVerified to true
   * and delete Emailverification entity
   * used in User create, update resolver
   * @param verificationCode
   * @returns
   */
  async VerifierEmailCode(
    verificationCode: string
  ): Promise<EmailVerificationOutput> {
    try {
      const EmailVerificationEntity =
        await this.EmailVerificationRepository.findOne({
          where: {
            verificationCode,
          },
          relations: ["user"],
        });
      if (!EmailVerificationEntity) throw "no corresponding code";
      const user = EmailVerificationEntity.user;
      user.isVerified = true;
      await this.UserRepository.save(this.UserRepository.create(user));
      await this.EmailVerificationRepository.delete(EmailVerificationEntity.id);
      return {
        user,
      };
    } catch (errorMessage) {
      return { isOk: false, errorMessage };
    }
  }
}

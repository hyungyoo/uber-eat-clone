import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RelationId, Repository } from "typeorm";
import { EmailVerification } from "./entities/email.verification.entity";
import { User } from "src/users/entities/users.entity";
import { EmailVerificationOutput } from "./dtos/email.verification.dto";

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailVerification)
    private readonly EmailVerificationRepository: Repository<EmailVerification>,
    @InjectRepository(User) private readonly UserRepository: Repository<User>
  ) {}

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

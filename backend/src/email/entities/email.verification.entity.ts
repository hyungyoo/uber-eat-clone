import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Content } from "src/baseData/base.entity";
import { User } from "src/users/entities/users.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { uuid } from "uuidv4";

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: "email_verification" })
export class EmailVerification extends Content {
  @Column({ name: "verification_code" })
  @Field((type) => String)
  verificationCode: string;

  @Field((type) => User)
  @OneToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @BeforeInsert()
  makeVerificationCode() {
    this.verificationCode = uuid();
  }
}

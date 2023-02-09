import { Field, ObjectType } from "@nestjs/graphql";
import { ParentEntity } from "src/baseData/base.entity";
import { User } from "src/users/entities/users.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { uuid } from "uuidv4";

@Entity({ name: "email_verification" })
@ObjectType()
export class EmailVerification extends ParentEntity {
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

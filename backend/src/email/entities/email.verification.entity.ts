import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { BasedEntity } from "src/baseData/base.entity";
import { User } from "src/users/entities/users.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: "email_verification" })
export class EmailVerification extends BasedEntity {
  @Column({ name: "verification_code" })
  @Field((type) => String)
  verificationCode: string;

  @Field((type) => User)
  @OneToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @BeforeInsert()
  makeVerificationCode() {
    this.verificationCode = uuidv4();
  }
}

import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";
import { IsEmail, IsEnum, IsString } from "class-validator";
import { ParentEntity } from "src/baseData/base.entity";
import { BeforeInsert, Column, Entity } from "typeorm";
import * as bcrypt from "bcryptjs";
import { HttpException, HttpStatus } from "@nestjs/common";
import { DisplayResult } from "src/baseData/base.display.result";
import { LoginDisplayResult } from "../dtos/login.dto";

enum UserRole {
  CLIENT,
  RESTAURANT,
  DELIVERY,
}

registerEnumType(UserRole, { name: "UserRole" });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends ParentEntity {
  @Column()
  @IsEmail()
  @Field((type) => String)
  email: string;

  @Column()
  @IsString()
  @Field((type) => String)
  name: string;

  @Column()
  @IsString()
  @Field((type) => String)
  password: string;

  @Column({ type: "enum", enum: UserRole })
  @IsEnum(UserRole)
  @Field((type) => UserRole)
  role: UserRole;

  @BeforeInsert()
  async MakeHashedPW(): Promise<void> {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async ValidatePW(InputPW: string): Promise<LoginDisplayResult> {
    try {
      const IsCorrectPW = await bcrypt.compare(InputPW, this.password);
      if (IsCorrectPW) return { isOk: true, token: "not yet!" };
      else return { isOk: false, errorMessage: "password not correct!" };
    } catch (errorMessage) {
      throw { isOk: false, errorMessage };
    }
  }
}

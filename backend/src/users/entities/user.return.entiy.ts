import { Field, ObjectType } from "@nestjs/graphql";
import { IsEmail, IsEnum, IsString } from "class-validator";
import { ParentEntity } from "src/baseData/base.entity";
import { UserRole } from "./users.entity";

@ObjectType()
export class UserReturnType extends ParentEntity {
  @IsEmail()
  @Field((type) => String)
  email: string;

  @IsString()
  @Field((type) => String)
  name: string;

  @IsEnum(UserRole)
  @Field((type) => UserRole)
  role: UserRole;
}

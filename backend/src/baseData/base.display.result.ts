import { Field, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsString } from "class-validator";
import { type } from "os";

@ObjectType()
export class DisplayResult {
  @Field((type) => Boolean)
  @IsBoolean()
  isOk: boolean;

  @Field((type) => String, { nullable: true })
  @IsString()
  errorMessage?: string;
}
import { Field, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsString } from "class-validator";

@ObjectType()
export class DisplayResult {
  @Field((type) => Boolean)
  @IsBoolean()
  isOk: boolean;

  @Field((type) => String, { nullable: true })
  @IsString()
  errorMessage?: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  token?: string;
}

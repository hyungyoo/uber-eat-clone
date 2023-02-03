import { Field, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsString } from "class-validator";

@ObjectType()
export class DisplayDtoResult {
  @Field((type) => Boolean)
  @IsBoolean()
  isOk: boolean;

  @Field((type) => String, { nullable: true })
  @IsString()
  errorMessage?: string;
}
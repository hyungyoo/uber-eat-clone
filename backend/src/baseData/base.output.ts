import { Field, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsString } from "class-validator";

@ObjectType()
export class CoreOutput {
  @Field((type) => Boolean, { defaultValue: true })
  @IsBoolean()
  isOk?: boolean;

  @Field((type) => String, { nullable: true })
  @IsString()
  errorMessage?: string;
}

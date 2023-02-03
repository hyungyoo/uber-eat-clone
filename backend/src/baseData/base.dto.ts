import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DisplayDtoResult {
  @Field((type) => Boolean)
  isOk: boolean;

  @Field((type) => String, { nullable: true })
  errorMessage?: string;
}

import { Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class UsersResolver {
  @Query((type) => String)
  isget() {
    return "example schema for setup";
  }
}

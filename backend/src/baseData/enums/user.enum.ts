import { registerEnumType } from "@nestjs/graphql";

export enum AllowedUserRole {
  CLIENT = "client",
  RESTAURANT_OWNER = "restaurant_owner",
  DELIVERY = "delivery",
}

export default registerEnumType(AllowedUserRole, {
  name: "AllowedUserRole",
  description: "roles for user",
});

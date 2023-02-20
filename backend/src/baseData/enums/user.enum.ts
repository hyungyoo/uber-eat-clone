import { registerEnumType } from "@nestjs/graphql";

export enum AllowedUserRole {
  CLIENT = "client",
  RESTAURANT_OWNER = "restaurant_owner",
  DELIVERY = "delivery",
  ADMIN = "admin",
}

export enum UserRoleForCreate {
  CLIENT = "client",
  RESTAURANT_OWNER = "restaurant_owner",
  DELIVERY = "delivery",
}

export default registerEnumType(UserRoleForCreate, {
  name: "UserRoleForCreate",
  description: "roles for user in graphql",
});

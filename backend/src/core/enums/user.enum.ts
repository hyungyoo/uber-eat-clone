import { registerEnumType } from "@nestjs/graphql";

export enum AllowedUserRole {
  CLIENT = "client",
  RESTAURANT_OWNER = "restaurant_owner",
  DELIVERY = "delivery",
  ADMIN = "admin",
}

registerEnumType(AllowedUserRole, {
  name: "AllowedUserRole",
  description: "roles for data base",
});

export enum UserRoleForCreate {
  CLIENT = "client",
  RESTAURANT_OWNER = "restaurant_owner",
  DELIVERY = "delivery",
}

registerEnumType(UserRoleForCreate, {
  name: "UserRoleForCreate",
  description: "role for graphql",
});

export default function AdapteUserRole(userRoleForCreate) {
  switch (userRoleForCreate) {
    case UserRoleForCreate.CLIENT:
      return AllowedUserRole.CLIENT;
    case UserRoleForCreate.RESTAURANT_OWNER:
      return AllowedUserRole.RESTAURANT_OWNER;
    case UserRoleForCreate.DELIVERY:
      return AllowedUserRole.DELIVERY;
  }
}

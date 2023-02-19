import { SetMetadata } from "@nestjs/common";
import { AllowedUserRole } from "src/baseData/enums/user.enum";

export type UserRoleType = keyof typeof AllowedUserRole | "USER" | "ADMIN";

export const UserRole = (userRole: UserRoleType[]) =>
  SetMetadata("userRole", userRole);

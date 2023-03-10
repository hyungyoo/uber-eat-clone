import { SetMetadata } from "@nestjs/common";
import { AllowedUserRole } from "src/core/enums/user.enum";

export type UserRoleType = keyof typeof AllowedUserRole | "USER";

export const UserRole = (userRole: UserRoleType[]) =>
  SetMetadata("userRole", userRole);

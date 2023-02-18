import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { UserRoleType } from "./decorators/roles.decorator";

/**
 * AuthGuard is called with APP_GUARD when resolver is requested
 * with UserRole decorator (SetMetaData), AuthGuard can get role of user with reflector
 * if userRole and user from userFromJWT are undefined, AuthGuard will return true (no decorator, no jwt for createUser and login resolver)
 * if userRole is defined but isUserFromJWT is undefined, AuthGuard will return false (decorator, but wrong jwt)
 * if userRole and user from isUserFromJWT are equal, reutrn true, false otherwise
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userRoleFromGuard = this.reflector.get<UserRoleType>(
      "userRole",
      context.getHandler()
    );
    const userFromJWT = await GqlExecutionContext.create(context).getContext()
      .user;
    if (userFromJWT && !userRoleFromGuard) return false; // for protection, after it will be deleted
    if (!userFromJWT) return Boolean(!userRoleFromGuard);
    return (
      (userRoleFromGuard.length === 1 &&
        userRoleFromGuard.includes(userFromJWT.role.toUpperCase())) ||
      userRoleFromGuard.includes("USER")
    );
  }
}

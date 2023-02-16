import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { UserRoleType } from "./decorators/roles.decorator";

/**
 * AuthGuard is called with APP_GUARD when resolver is requested
 * with UserRole decorator (SetMetaData), AuthGuard can get role of user with reflector
 * if userRole and user from gqlRequest are undefined, AuthGuard will return true (no decorator, no jwt for createUser and login resolver)
 * if userRole and user from gqlRequest are equal, reutrn true, false otherwise
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log("auth gueard called");

    const userRole = this.reflector.get<UserRoleType>(
      "userRole",
      context.getHandler()
    );
    const gqlRequest = GqlExecutionContext.create(context).getContext();
    if (!userRole && !gqlRequest.user) return true;
    console.log(userRole.toLowerCase(), "//////////////////////// is userRole");
    console.log(
      gqlRequest.user.role,
      "/////////////////////// is user role in request"
    );
    console.log(
      userRole.toLowerCase() === gqlRequest.user.role,
      "/////////////////////// is result"
    );
    // comparer userRole and role from gqlRequest.user.role,
    // if not comparere, no right for access!
    // return false
    // comparer with userRole, and user.role, but diff!
    return (
      userRole.toLowerCase() === "user" ||
      userRole.toLowerCase() === gqlRequest.user.role
    );
  }
}

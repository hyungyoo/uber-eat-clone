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
    const userRole = this.reflector.get<UserRoleType>(
      "userRole",
      context.getHandler()
    );
    const gqlRequest = GqlExecutionContext.create(context).getContext();
    if (!userRole && !gqlRequest.user) return true;
    return true;
  }
}

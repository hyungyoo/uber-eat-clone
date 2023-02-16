import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { UserRoleType } from "./decorators/roles.decorator";

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
    // for create and update, so return true
    if (!userRole) return true;
    // comparer userRole and role from gqlRequest.user.role,
    // if not comparere, no right for access!
    // return false
    const gqlRequest = GqlExecutionContext.create(context).getContext();
    // comparer with userRole, and user.role, but diff!
    if (gqlRequest.user) return true;
    return false;
  }
}

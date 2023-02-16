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
    if (!userRole) return true;
    const gqlRequest = GqlExecutionContext.create(context).getContext();
    console.log(
      userRole,
      gqlRequest.user.role,
      " comparer!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );
    if (gqlRequest.user) return true;
    return false;
  }
}

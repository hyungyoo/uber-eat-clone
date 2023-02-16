import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log("auth gueard called");
    const gqlRequest = GqlExecutionContext.create(context).getContext();
    if (gqlRequest.user) return true;
    return false;
  }
}

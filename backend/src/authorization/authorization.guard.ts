import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log("i am in authorization guard");
    const gqlContext = GqlExecutionContext.create(context).getContext();
    if (!gqlContext["user"]) return false;
    return true;
    // return false;
  }
}

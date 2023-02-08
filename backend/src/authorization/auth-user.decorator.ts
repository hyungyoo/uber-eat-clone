import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    console.log(" i am in AuthUser decorator");
    const request = GqlExecutionContext.create(ctx).getContext();
    return request.user;
  }
);

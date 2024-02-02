import {ExecutionContext, createParamDecorator} from "@nestjs/common";

export const GetCurrentUserId = createParamDecorator(
  (data: string | undefined, context: ExecutionContext): string => {
    const {user} = context.switchToHttp().getRequest();
    return user['sub'];
  },
);
/* GET USER DECORATOR
   Extracts the user object (or a specific property) from the Request.
   This works because JwtStrategy's validate() method attaches it there.
*/
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If a specific property is requested (e.g., @GetUser('userId')), return only that
    return data ? user?.[data] : user;
  },
);

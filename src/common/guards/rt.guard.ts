import { AuthGuard } from "@nestjs/passport";
import {ExecutionContext} from "@nestjs/common";
import {Reflector} from "@nestjs/core";

export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
    constructor() {
        super();
    }
    // canActivate(context: ExecutionContext) {
    //     const isPublic = this.reflector.getAllAndOverride('public', [
    //         context.getHandler(),
    //         context.getClass()
    //     ]);
    //     if (isPublic) return true;
    //     return super.canActivate(context);
    // }
}
import {ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Role} from "src/utils/enums/role.enum";
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class RoleGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('public',
      [
        context.getHandler(),
        context.getClass(),
      ]
    );
    if (isPublic) return true;

    const baseGuardResult = await super.canActivate(context);
    if (!baseGuardResult) return false;

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles',
      [
        context.getHandler(),
        context.getClass(),
      ]
    );
    if (!requiredRoles) return true;

    const {user} = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
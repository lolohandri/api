import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/utils/enums/role.enum';

export const Roles = (...roles: Role[]) =>
    SetMetadata('roles', roles);
import {Role} from "../enums/role.enum";

export type JwtPayload = {
  sub: string;
  username: string;
  role: Role;
}
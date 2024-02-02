import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import {JwtPayload} from "../../utils/types/jwt-payload.type";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.ACCESS_TOKEN_SECRET
            }
        );
    }

    async validate(payload: JwtPayload) : Promise<JwtPayload> {
        return payload;
    }
}
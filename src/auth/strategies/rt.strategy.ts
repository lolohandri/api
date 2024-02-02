import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Request} from "express";
import {Injectable} from "@nestjs/common";
import {JwtPayload} from "../../utils/types/jwt-payload.type";
import {JwtPayloadWithRt} from "../../utils/types/jwt-payload-with-rt.type";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      }
    );
  }

  async validate(payload: JwtPayload) : Promise<JwtPayload>  {
    return payload;
  }
}
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../config/jwt.config";
import { AuthJwtPayload } from "../types/auth-jwtPayload";
import { Inject, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private authService: AuthService,
  ) {
    console.log('🚀 JwtStrategy constructor');
    console.log('🚀 jwtConfiguration:', jwtConfiguration);
    console.log('🚀 jwtConfiguration.secret:', jwtConfiguration.secret ? 'EXISTS' : 'MISSING');
    console.log('🚀 jwtConfig.KEY:', jwtConfig.KEY);


    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: AuthJwtPayload) {
    const usucod = payload.userData.userCode;
    return this.authService.validateJwtUser(usucod);
  }
}

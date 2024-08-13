import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JWTPayload } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<JWTPayload> {
    if (!payload || !payload.sub || !payload.role) {
      throw new UnauthorizedException('Invalid token');
    }

    return { sub: payload.sub, role: payload.role }; // Attach role to request user object
  }
}

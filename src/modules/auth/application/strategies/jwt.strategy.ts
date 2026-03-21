/* JWT STRATEGY - FIXED */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SystemConfigurationException } from 'src/modules/common/domain/exceptions/SystemConfigurationException';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    // 2. Validación de seguridad para TypeScript
    if (!secret) {
      throw new SystemConfigurationException('Falta la variable JWT_SECRET');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // Ahora TS sabe que es un string 100% real
    });
  }

  async validate(payload: any) {
    // Lo que retornes aquí se inyectará en req.user
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}

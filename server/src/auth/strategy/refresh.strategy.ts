import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
//import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { UserWithSecret } from '../../schema';
import { Env } from '../../config/config-schema';
import { AuthService } from '../auth.service';
import type { Request } from 'express';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService<Env>,
  ) {
    const extractors = [
      (req: Request): string | null => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return req.cookies?.['Refresh'] ?? null;
      },
    ];
    super({
      jwtFromRequest: ExtractJwt.fromExtractors(extractors),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('REFRESH_SECRET_JWT'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: {
      sub: string;
      email: string;
      name: string;
      type: 'refresh';
    },
  ): Promise<UserWithSecret> {
    const data = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      type: payload.type,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const token = req?.cookies?.['Refresh'] as string;
    console.log(data);
    if (!token) throw new UnauthorizedException('EmptyRefreshToken');
    return await this.authService.validateRefreshToken(data.id, token);
  }
}

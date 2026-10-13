import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { UserWithSecret } from '../../schema';
import { Env } from '../../config/config-schema';
import type { Request } from 'express';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService<Env>,
  ) {
    const extractors = (req: Request): string | null => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return req?.cookies?.['Authentication'] ?? null;
    };
    super({
      jwtFromRequest: extractors,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    name: string;
  }): Promise<UserWithSecret> {
    const data = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
    return await this.userService.findOne(data.id);
  }
}

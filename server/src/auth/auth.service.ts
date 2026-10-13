import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserPayload, UserDto, UserWithSecret } from '../schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generatoken(grantType: 'access' | 'refresh', user: UserWithSecret) {
    switch (grantType) {
      case 'access':
        return this.jwtService.sign(
          {
            sub: user.id,
            email: user.email,
            name: user.name,
          },
          {
            secret: this.configService.getOrThrow('JWT_SECRET'),
            expiresIn: '15m',
          },
        );
      case 'refresh':
        return this.jwtService.sign(
          {
            sub: user.id,
            email: user.email,
            name: user.name,
            type: 'refresh',
          },
          {
            secret: this.configService.getOrThrow('REFRESH_SECRET_JWT'),
            expiresIn: '7d',
          },
        );
    }
  }

  // remplacer les token en memoire par le nouveau generé
  async setRefreshToken(userId: string, token: string | null) {
    if (!token) {
      return await this.userService.updateSecrets(userId, {
        refreshToken: undefined,
      });
    }
    const hashToken = await bcrypt.hash(token, 10);
    await this.userService.updateSecrets(userId, { refreshToken: hashToken });
  }

  //verifier si le token pour l'utilisateur actuelle est valide c-a-d egale à celui en memoire
  async validateRefreshToken(userId: string, token: string) {
    const user = await this.userService.findOne(userId);
    const currentToken = user.secret?.refreshToken;
    if (!currentToken) {
      throw new UnauthorizedException('EmptyInternalRefreshToken');
    }
    const isValid = await bcrypt.compare(token, currentToken);
    if (!isValid) throw new UnauthorizedException('InvalidRefreshToken');
    return user;
  }

  async register(payload: CreateUserPayload): Promise<UserDto> {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(payload.password, salt);

    return await this.userService.create({
      ...payload,
      password: hashPassword,
    });
  }

  async authenticate(
    email: string,
    password: string,
  ): Promise<UserWithSecret | null> {
    const user = await this.userService.findByIdentifier(email);
    if (!user || !user.secret) return null;
    const isValid = await bcrypt.compare(password, user.secret.password);
    if (!isValid) return null;
    await this.userService.setLastSignIn(user.id);
    return user;
  }

  // async refreshToken(user: UserWithSecret, token: string) {
  //   await this.validateRefreshToken(user.id, token);
  //   const accessToken = this.generatoken('access', user);
  //   const refreshToken = this.generatoken('refresh', user);
  //   await this.setRefreshToken(user.id, refreshToken);
  //   return { accessToken, refreshToken };
  // }
}

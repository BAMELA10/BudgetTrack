import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserWithSecret } from '../schema';
import { CreateUserPayload } from '../schema';
import type { Response, Request } from 'express';
import { LocalGuard } from './guards/local/localguard.guard';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt/jwt.guard';
import { RefreshGuard } from './guards/refresh/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  async exchangeToken(user: UserWithSecret) {
    const accessToken = this.authService.generatoken('access', user);
    const refreshToken = this.authService.generatoken('refresh', user);

    // save refresh token
    await this.authService.setRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async handleTokenForAuthenticationResponse(
    user: UserWithSecret,
    res: Response,
  ) {
    //genation du token d'authentification;
    const { accessToken, refreshToken } = await this.exchangeToken(user);
    //put token on cookie response
    res.cookie('Authentication', accessToken, {
      expires: new Date(Date.now() + 1000 * 60 * 15),
      //signed: true,
      //secure: true,
      httpOnly: true,
    });
    res.cookie('Refresh', refreshToken, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      //signed: true,
      //secure: true,
      httpOnly: true,
    });

    res.status(200).send(user);
  }

  @Post('register')
  async register(@Body() payload: CreateUserPayload, @Res() res: Response) {
    await this.authService.register(payload);
    const userWithSecret = await this.authService.authenticate(
      payload.email,
      payload.password,
    );
    if (!userWithSecret) throw new InternalServerErrorException();
    return this.handleTokenForAuthenticationResponse(userWithSecret, res);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request, @Res() res: Response) {
    return await this.handleTokenForAuthenticationResponse(
      req.user as UserWithSecret,
      res,
    );
  }

  @Get('refresh')
  @UseGuards(RefreshGuard)
  async refresh(@Req() req: Request, @Res() res: Response) {
    return await this.handleTokenForAuthenticationResponse(
      req.user as UserWithSecret,
      res,
    );
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.setRefreshToken(
      (req.user as UserWithSecret).id,
      null,
    );
    res.clearCookie('Authentication');
    res.clearCookie('Refresh');

    res.status(200).send({ message: 'logout complete' });
  }
}

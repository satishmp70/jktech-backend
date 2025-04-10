import { Controller, Post, Body, UseGuards, Req, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @ApiBearerAuth()
  logout(@Req() req) {
    //  blacklisting (if implemented)
    return {
      message: 'Logout successful. Please delete the token on client-side.',
    };
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() { }


  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  handleGoogleCallback(@Req() req: any, @Res() res: Response) {
    const token = req.user.token;
    return res.redirect(`http://localhost:4200/auth/callback?token=${token}`);
  }

  // @Public()
  // @Get('google/redirect')
  // @UseGuards(AuthGuard('google'))
  // async googleRedirect(@Req() req, @Res() res: Response) {
  //   const user = req.user;

  //   const jwt = await this.authService.validateOAuthLogin(user, 'google');

  //   const frontendUrl = `http://localhost:4200/auth/callback?token=${jwt.access_token}&user=${encodeURIComponent(JSON.stringify(jwt.user))}`;
  //   return res.redirect(frontendUrl);

  // }

  @Public()
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() { }

  @Public()
  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  facebookRedirect(@Req() req) {
    const token = this.authService.generateToken(req.user);
    return { token, user: req.user };
  }

}

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

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  handleGoogleCallback(@Req() req: any, @Res() res: Response) {
    const token = req.user.token;
    return res.redirect(`http://localhost:4200/auth/callback?token=${token}`);
  }

  @Public()
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  @Public()
  async facebookAuth() {
    
  }

  @Public()
  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  @Public()
  handleFacebookCallback(@Req() req, @Res() res: Response) {
    const token = req.user.token;
    return res.redirect(`http://localhost:4200/auth/callback?token=${token}&provider=facebook`);
  }

}

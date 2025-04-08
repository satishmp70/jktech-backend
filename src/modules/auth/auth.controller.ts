import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { messagesConstant } from '../../common/constants/messages.constant';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private usersService: UsersService
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || user.isDeleted) {
      throw new UnauthorizedException(messagesConstant.INVALID_CRED);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException(messagesConstant.INVALID_CRED);
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException(messagesConstant.INVALID_CRED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(messagesConstant.INVALID_CRED);
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name.toUpperCase(),
    };

    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
      },
    };
  }

  generateToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }
  
  async validateOAuthLogin(profile: any, provider: 'google' | 'facebook'): Promise<{ access_token: string; user: any }> {
    const user = await this.usersService.findOrCreate(profile, provider);
    const payload = { sub: user.id, role: user.role.name };
    const access_token = this.jwtService.sign(payload);
    return { access_token, user };
  }

}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const { id, name, emails, photos } = profile;

    const userProfile = {
      id,
      name: name.givenName + ' ' + name.familyName,
      email: emails[0].value,
      avatar: photos[0].value,
    };

    const userWithToken = await this.authService.validateOAuthLogin(userProfile, 'google');

    done(null, {
      ...userWithToken.user,
      token: userWithToken.access_token,
    });
  }
}

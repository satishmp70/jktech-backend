import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, name, emails, photos } = profile;

      const userProfile = {
        id,
        name: `${name.givenName} ${name.familyName}`,
        email: emails[0].value,
        avatar: photos[0].value,
      };

      const result = await this.authService.validateOAuthLogin(userProfile, 'google');
      done(null, {
        ...result.user,
        token: result.access_token,
      });
    } catch (error) {
      done(error, false);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
      callback: configService.get<string>('FACEBOOK_CALLBACK_URL'),    
      profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
      scope: 'email',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, emails, name, photos } = profile;

    const userProfile = {
      facebookId: id,
      email: emails?.[0]?.value ?? '', 
      name: `${name?.givenName ?? ''} ${name?.familyName ?? ''}`, 
      avatar: photos?.[0]?.value ?? '',
    };

    return this.authService.validateOAuthLogin(userProfile, 'facebook');
  }
}

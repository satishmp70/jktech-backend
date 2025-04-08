import { Module } from '@nestjs/common';
import { GoogleOauthController } from './google-oauth.controller';

@Module({
  controllers: [GoogleOauthController]
})
export class GoogleOauthModule {}

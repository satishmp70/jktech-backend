import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PasswordService } from './common/services/password.service';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BlogModule } from './modules/blog/blog.module';

import { JwtAuthGuard } from './modules/auth/guards/jwt.guard';
import { serverConfig, validate } from './configurations';
import { appConfig } from './configurations/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['local.env', 'development.env', 'production.env', '.env'],
      load: [serverConfig, appConfig],
      cache: true,
      validate,
    }),
    AuthModule,
    UsersModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    PasswordService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        stopAtFirstError: true,
        whitelist: true,
        forbidUnknownValues: true,
        forbidNonWhitelisted: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [PasswordService],
})
export class AppModule {}

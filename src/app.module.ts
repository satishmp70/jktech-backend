import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt.guard';
import { PasswordService } from './common/services/password.service';
import { BlogModule } from './modules/blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule, UsersModule,BlogModule],
  controllers: [AppController],
  providers: [AppService, PrismaService,{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },PasswordService],
  exports:[PasswordService],
})
export class AppModule {}

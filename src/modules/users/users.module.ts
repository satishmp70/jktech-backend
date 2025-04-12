import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { RoleService } from './role/role.service';
import { UserPolicyService } from './policies/user-policy.service';
import { PasswordService } from '../../common/services/password.service';



@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, RoleService,UserPolicyService,PasswordService],
  exports: [UsersService],
})
export class UsersModule {}

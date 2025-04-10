import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordService } from 'src/common/services/password.service';
import { messagesConstant } from 'src/common/constants/messages.constant';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) { }

  async create(data: CreateUserDto) {
    if (!data.password) {
      throw new BadRequestException(messagesConstant.PASSWORD_REQUIRED);
    }

    const hashedPassword = await this.passwordService.hashPassword(data.password);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findAll(page: number = 1) {
    return this.prisma.user.findMany({
      where: { isDeleted: false },
      skip: (page - 1) * 10,
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findOneById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: number, data: UpdateUserDto) {
    if (data.password) {
      data.password = await this.passwordService.hashPassword(data.password);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
  async findOrCreate(profile: any, provider: 'google' | 'facebook'): Promise<any> {
    const providerId = String(profile.id);

    const whereClause = provider === 'google'
      ? { googleId: providerId }
      : { facebookId: providerId };

    let user = await this.prisma.user.findFirst({
      where: whereClause,
      include: { role: true },
    });

    if (!user) {
      user = await this.prisma.user.findUnique({
        where: { email: profile.email },
        include: { role: true }, 
      });

      if (user) {
        return this.prisma.user.update({
          where: { email: profile.email },
          data: {
            googleId: provider === 'google' ? providerId : undefined,
            facebookId: provider === 'facebook' ? providerId : undefined,
          },
          include: { role: true },
        });
      }
    }

    if (!user) {
      const defaultRole = await this.prisma.role.findFirst({ where: { name: 'User' } });
      if (!defaultRole) throw new Error('Default role not found');

      return this.prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          avatar: profile.picture || profile.avatar || null,
          googleId: provider === 'google' ? providerId : undefined,
          facebookId: provider === 'facebook' ? providerId : undefined,
          roleId: defaultRole.id,
        },
        include: { role: true },
      });
    }

    return user;
  }



}

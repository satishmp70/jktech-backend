import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordService } from 'src/common/services/password.service';
import { messagesConstant } from 'src/common/constants/messages.constant';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService, private readonly passwordService: PasswordService,
  ) { }

  async create(data: CreateUserDto) {
    if (!data.password) {
      throw new BadRequestException(messagesConstant.PASSWORD_REQUIRED);
    }
    const hashedPassword = await this.passwordService.hashPassword(data.password);
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
    return user;
  }

  async findAll(page: number = 1) {
    const users = await this.prisma.user.findMany({
      where: { isDeleted: false },
      skip: (page - 1) * 10,
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    return users;
  }

  async findOneById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });
  
    if (!user) return null;
  
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
}

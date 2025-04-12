import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async getOneById(id: number) {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  async getAll() {
    return this.prisma.role.findMany();
  }

  async create(name: string) {
    return this.prisma.role.create({
      data: { name },
    });
  }

  async delete(id: number) {
    return this.prisma.role.delete({
      where: { id },
    });
  }
}

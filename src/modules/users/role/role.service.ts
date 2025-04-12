import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async getOneById(id: number) {
    if (!id) {
      throw new Error('Invalid ID'); // You can throw a custom error or handle it as needed
    }

    return this.prisma.role.findUnique({
      where: { id }, // Ensure `id` is valid
    });
  }

  async getAll() {
    return this.prisma.role.findMany();
  }

  async create(name: string, id: number) { 
    return this.prisma.role.create({
      data: { id, name }, 
    });
  }

  async delete(id: number) {
    if (!id) {
      throw new Error('Invalid ID');
    }

    return this.prisma.role.delete({
      where: { id },
    });
  }
}

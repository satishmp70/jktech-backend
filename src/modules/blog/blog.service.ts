import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new blog post
  async create(userId: number, data: CreateBlogDto) {
    return this.prisma.blog.create({
      data: {
        ...data,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  // Get all blog posts
  async findAll() {
    return this.prisma.blog.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // Get blogs for the logged-in user
  async findUserBlogs(userId: number) {
    return this.prisma.blog.findMany({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // Get blog by ID
  async findOneById(id: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async update(id: number, data: UpdateBlogDto) {
    return this.prisma.blog.update({
      
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.blog.delete({ where: { id } });
  }
}

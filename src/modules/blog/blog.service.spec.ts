import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from './blog.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('BlogService', () => {
  let service: BlogService;
  let prisma: PrismaService;

  const mockPrismaService = {
    blog: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new blog post', async () => {
      const dto = { title: 'Test', content: 'Hello' };
      const userId = 1;

      mockPrismaService.blog.create.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(userId, dto);

      expect(mockPrismaService.blog.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          user: { connect: { id: userId } },
        },
      });

      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('should return all blogs with user info', async () => {
      const blogs = [{ id: 1 }, { id: 2 }];
      mockPrismaService.blog.findMany.mockResolvedValue(blogs);

      const result = await service.findAll();

      expect(mockPrismaService.blog.findMany).toHaveBeenCalledWith({
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      });

      expect(result).toEqual(blogs);
    });
  });

  describe('findUserBlogs', () => {
    it('should return blogs by user ID', async () => {
      const blogs = [{ id: 1, userId: 1 }];
      mockPrismaService.blog.findMany.mockResolvedValue(blogs);

      const result = await service.findUserBlogs(1);

      expect(mockPrismaService.blog.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      });

      expect(result).toEqual(blogs);
    });
  });

  describe('findOneById', () => {
    it('should return blog by ID', async () => {
      const blog = { id: 1, title: 'Test' };
      mockPrismaService.blog.findUnique.mockResolvedValue(blog);

      const result = await service.findOneById(1);

      expect(mockPrismaService.blog.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      });

      expect(result).toEqual(blog);
    });

    it('should throw NotFoundException if blog not found', async () => {
      mockPrismaService.blog.findUnique.mockResolvedValue(null);

      await expect(service.findOneById(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a blog post', async () => {
      const dto = { title: 'Updated', content: 'Updated content' };
      mockPrismaService.blog.update.mockResolvedValue({ id: 1, ...dto });

      const result = await service.update(1, dto);

      expect(mockPrismaService.blog.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });

      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('delete', () => {
    it('should delete a blog post', async () => {
      const deleted = { id: 1 };
      mockPrismaService.blog.delete.mockResolvedValue(deleted);

      const result = await service.delete(1);

      expect(mockPrismaService.blog.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual(deleted);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordService } from '../../common/services/password.service';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { messagesConstant } from '../../common/constants/messages.constant';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
  },
  role: {
    findFirst: jest.fn(),
  },
};

const mockPasswordService = {
  hashPassword: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PasswordService, useValue: mockPasswordService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create()', () => {
    it('should throw if password is not provided', async () => {
      await expect(service.create({ email: 'test@example.com' } as any)).rejects.toThrow(
        new BadRequestException(messagesConstant.PASSWORD_REQUIRED),
      );
    });

    it('should hash password and create user', async () => {
      mockPasswordService.hashPassword.mockResolvedValue('hashed');
      mockPrismaService.user.create.mockResolvedValue({ id: 1 });

      const result = await service.create({ email: 'test@example.com', password: '123456' } as any);

      expect(mockPasswordService.hashPassword).toHaveBeenCalledWith('123456');
      expect(mockPrismaService.user.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ password: 'hashed' }) }),
      );
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('findAll()', () => {
    it('should return paginated users', async () => {
      const users = [{ id: 1 }, { id: 2 }];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll(1);
      expect(result).toEqual(users);
    });
  });

  describe('findOneById()', () => {
    it('should return user without password', async () => {
      const user = { id: 1, password: 'secret', name: 'Test', role: { name: 'User' } };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findOneById(1);
      expect(result).not.toHaveProperty('password');
      expect(result).toMatchObject({ id: 1, name: 'Test' });
    });

    it('should throw if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.findOneById(123)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should hash password if provided', async () => {
      mockPasswordService.hashPassword.mockResolvedValue('hashed');
      mockPrismaService.user.update.mockResolvedValue({ id: 1 });

      await service.update(1, { password: 'newpass' });
      expect(mockPasswordService.hashPassword).toHaveBeenCalledWith('newpass');
    });

    it('should update user without hashing if no password', async () => {
      mockPrismaService.user.update.mockResolvedValue({ id: 1 });

      await service.update(1, { name: 'Updated' });
      expect(mockPasswordService.hashPassword).not.toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('should mark user as deleted', async () => {
      mockPrismaService.user.update.mockResolvedValue({ id: 1, isDeleted: true });

      const result = await service.remove(1);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isDeleted: true },
      });
      expect(result).toEqual({ id: 1, isDeleted: true });
    });
  });

  describe('findOrCreate()', () => {
    it('should find user by providerId and return it', async () => {
      const mockUser = { id: 1, name: 'OAuthUser' };
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.findOrCreate({ id: '123', email: 'test@fb.com' }, 'facebook');
      expect(result).toEqual(mockUser);
    });

    it('should update user with providerId if email exists', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      const existing = { id: 2, email: 'test@fb.com' };
      mockPrismaService.user.findUnique.mockResolvedValue(existing);
      mockPrismaService.user.update.mockResolvedValue({ ...existing, facebookId: '123' });

      const result = await service.findOrCreate({ id: '123', email: 'test@fb.com' }, 'facebook');
      expect(result.facebookId).toBe('123');
    });

    it('should create user with default role if not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.role.findFirst.mockResolvedValue({ id: 99, name: 'User' });
      mockPrismaService.user.create.mockResolvedValue({ id: 10 });

      const result = await service.findOrCreate({ id: '123', email: 'new@user.com', name: 'New' }, 'google');
      expect(result).toEqual({ id: 10 });
    });
  });
});

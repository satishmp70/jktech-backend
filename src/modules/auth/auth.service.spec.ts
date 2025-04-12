import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { messagesConstant } from '../../common/constants/messages.constant';
jest.mock('bcrypt');
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let usersService: UsersService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockUsersService = {
    findOrCreate: jest.fn().mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      role: { name: 'user' },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('validateUser', () => {
    it('should throw if user not found or deleted', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      await expect(service.validateUser('email', 'password')).rejects.toThrow(
        new UnauthorizedException(messagesConstant.INVALID_CRED),
      );
    });

    it('should throw if password does not match', async () => {
      const user = { password: 'hashed', isDeleted: false };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.validateUser('email', 'password')).rejects.toThrow(
        new UnauthorizedException(messagesConstant.INVALID_CRED),
      );
    });

    it('should return user if credentials match', async () => {
      const user = { password: 'hashed', isDeleted: false };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await service.validateUser('email', 'password');
      expect(result).toEqual(user);
    });

  });

  describe('login', () => {
    it('should throw if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.login('email', 'pass')).rejects.toThrow(
        new UnauthorizedException(messagesConstant.INVALID_CRED),
      );
    });

    it('should throw if password is invalid', async () => {
      const user = {
        password: 'hashed',
        isDeleted: false,
        role: { name: 'user' },
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login('email', 'pass')).rejects.toThrow(
        new UnauthorizedException(messagesConstant.INVALID_CRED),
      );
    });
    it('should return token and user if valid', async () => {
      const user = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed',
        isDeleted: false,
        role: { name: 'user' },
      };
    
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    
      const result = await service.login('test@example.com', 'password');
    
      expect(result).toEqual({
        accessToken: 'mock-token',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
      });
    });
    

  });

  describe('generateToken', () => {
    it('should return jwt token', () => {
      const user = { id: 1, email: 'test@example.com' };
      const result = service.generateToken(user);
      expect(result).toBe('mock-token');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@example.com',
      });
    });
  });

  describe('validateOAuthLogin', () => {
    it('should call usersService.findOrCreate and return token', async () => {
      const profile = { email: 'oauth@example.com' };
      const result = await service.validateOAuthLogin(profile, 'google');
      expect(usersService.findOrCreate).toHaveBeenCalledWith(profile, 'google');
      expect(result).toEqual({
        access_token: 'mock-token',
        user: {
          id: 1,
          email: 'test@example.com',
          role: { name: 'user' },
        },
      });
    });
  });
});

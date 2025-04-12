import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({
      access_token: 'test-token',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login()', () => {
    it('should call AuthService.login and return token', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
      const result = await controller.login(loginDto);
      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(result).toEqual({ access_token: 'test-token' });
    });
  });

  describe('logout()', () => {
    it('should return logout message', () => {
      const req = { user: { id: 1 } }; // mock user
      const result = controller.logout(req);
      expect(result).toEqual({
        message: 'Logout successful. Please delete the token on client-side.',
      });
    });
  });

  describe('handleGoogleCallback()', () => {
    it('should redirect to Angular frontend with token', () => {
      const mockReq = { user: { token: 'google-token' } };
      const mockRes = {
        redirect: jest.fn(),
      } as unknown as Response;

      controller.handleGoogleCallback(mockReq, mockRes);
      expect(mockRes.redirect).toHaveBeenCalledWith(
        'http://localhost:4200/auth/callback?token=google-token',
      );
    });
  });

  describe('handleFacebookCallback()', () => {
    it('should redirect to Angular frontend with token and provider', () => {
      const mockReq = { user: { token: 'facebook-token' } };
      const mockRes = {
        redirect: jest.fn(),
      } as unknown as Response;

      controller.handleFacebookCallback(mockReq, mockRes);
      expect(mockRes.redirect).toHaveBeenCalledWith(
        'http://localhost:4200/auth/callback?token=facebook-token&provider=facebook',
      );
    });
  });
});

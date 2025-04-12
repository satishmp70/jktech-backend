import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RoleService } from './role/role.service';
import { UserPolicyService } from './policies/user-policy.service';
import { ConflictException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { messagesConstant } from '../../common/constants/messages.constant';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let roleService: RoleService;
  let userPolicyService: UserPolicyService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneByEmail: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRoleService = {
    getOneById: jest.fn(),
  };

  const mockPolicyService = {
    validateUpdateAccess: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: RoleService, useValue: mockRoleService },
        { provide: UserPolicyService, useValue: mockPolicyService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    roleService = module.get<RoleService>(RoleService);
    userPolicyService = module.get<UserPolicyService>(UserPolicyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto = { email: 'test@example.com', roleId: 1 ,name: ''};
      mockRoleService.getOneById.mockResolvedValue({ id: 1 });
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      const result = await controller.create(dto);

      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ message: messagesConstant.ADD_USER_RESPONSE });
    });

    it('should throw if role not found', async () => {
      mockRoleService.getOneById.mockResolvedValue(null);
      await expect(controller.create({
        email: 'a@b.com', roleId: 99,
        name: ''
      }))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw if user already exists', async () => {
      mockRoleService.getOneById.mockResolvedValue({ id: 1 });
      mockUsersService.findOneByEmail.mockResolvedValue({ id: 1 });
      await expect(controller.create({
        email: 'exists@test.com', roleId: 1,
        name: ''
      }))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const users = [{ id: 1 }, { id: 2 }];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll({ page: 1 });
      expect(result).toEqual({ message: messagesConstant.USER_FETCHED, result: users });
    });
  });

  describe('findOne', () => {
    it('should return user if admin', async () => {
      const user = { id: 1 };
      mockUsersService.findOneById.mockResolvedValue(user);

      const result = await controller.findOne(1, { user: { id: 2, role: 'Admin' } });

      expect(result).toEqual({ message: messagesConstant.USER_FETCHED, result: user });
    });

    it('should allow user to fetch themselves', async () => {
      const user = { id: 5 };
      mockUsersService.findOneById.mockResolvedValue(user);

      const result = await controller.findOne(5, { user: { id: 5, role: 'User' } });

      expect(result).toEqual({ message: messagesConstant.USER_FETCHED, result: user });
    });

    it('should throw if unauthorized', async () => {
      await expect(controller.findOne(1, { user: { id: 2, role: 'User' } }))
        .rejects.toThrow(ForbiddenException);
    });

    it('should throw if user not found', async () => {
      mockUsersService.findOneById.mockResolvedValue(null);

      await expect(controller.findOne(10, { user: { id: 10, role: 'User' } }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const dto = { name: 'Updated', roleId: 1 };

    it('should update user if authorized', async () => {
      const user = { id: 1 };

      mockUsersService.findOneById.mockResolvedValue(user);
      mockRoleService.getOneById.mockResolvedValue({ id: 1 });

      const result = await controller.update(1, dto, { user: { id: 1, role: 'User' } });

      expect(userPolicyService.validateUpdateAccess).toHaveBeenCalled();
      expect(mockUsersService.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ message: messagesConstant.USER_UPDATED });
    });

    it('should throw if user not found', async () => {
      mockUsersService.findOneById.mockResolvedValue(null);

      await expect(controller.update(99, dto, { user: { id: 99, role: 'User' } }))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw if invalid roleId', async () => {
      mockUsersService.findOneById.mockResolvedValue({ id: 1 });
      mockRoleService.getOneById.mockResolvedValue(null);

      await expect(controller.update(1, { roleId: 999 }, { user: { id: 1, role: 'User' } }))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete user', async () => {
      mockUsersService.findOneById.mockResolvedValue({ id: 1 });

      const result = await controller.remove(1);

      expect(mockUsersService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: messagesConstant.USER_DELETED });
    });

    it('should throw if user not found', async () => {
      mockUsersService.findOneById.mockResolvedValue(null);

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});

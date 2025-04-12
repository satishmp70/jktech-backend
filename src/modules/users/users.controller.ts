import {
    Controller, Get, Post, Body, Param, Delete, Query,
    BadRequestException, ConflictException, NotFoundException, ParseIntPipe, Put,
    UseGuards,
    ForbiddenException,
    Request
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { RoleService } from './role/role.service';
import { Public, Roles } from '../../../src/common/decorators/public.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Role } from '../../../src/common/decorators/role.enum';
import { messagesConstant } from '../../common/constants/messages.constant';
import { UserPolicyService } from './policies/user-policy.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly roleService: RoleService,
        private readonly userPolicyService: UserPolicyService,
    ) { }

    @Public()
    @Post()
    async create(@Body() dto: CreateUserDto) {
        const role = await this.roleService.getOneById(dto.roleId);
        if (!role) throw new BadRequestException(messagesConstant.INVALID_ROLE_ID);

        const user = await this.usersService.findOneByEmail(dto.email);
        if (user) throw new ConflictException(messagesConstant.USER_ALREADY_EXISTS);

        await this.usersService.create(dto);
        return { message: messagesConstant.ADD_USER_RESPONSE };
    }

    @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    async findAll(@Query() query: FindAllUsersDto) {
        const { page } = query;
        const result = await this.usersService.findAll(page);
        return { message: messagesConstant.USER_FETCHED, result };
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
    ) {
        const loggedInUser = req.user;

        if (loggedInUser.role !== 'Admin' && loggedInUser.id !== id) {
            throw new ForbiddenException(messagesConstant.NOT_ALLOWED);
        }

        const user = await this.usersService.findOneById(id);
        if (!user) {
            throw new NotFoundException(messagesConstant.USER_NOT_FOUND);
        }

        return {
            message: messagesConstant.USER_FETCHED,
            result: user,
        };
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
        @Request() req,
    ) {
        const currentUser = req.user;
        await this.userPolicyService.validateUpdateAccess(currentUser, id, updateUserDto);

        const user = await this.usersService.findOneById(id);
        if (!user) {
            throw new NotFoundException(messagesConstant.USER_NOT_FOUND);
        }

        if (updateUserDto.roleId) {
            const role = await this.roleService.getOneById(updateUserDto.roleId);
            if (!role) {
                throw new BadRequestException(messagesConstant.INVALID_ROLE_ID);
            }
        }

        await this.usersService.update(id, updateUserDto);

        return { message: messagesConstant.USER_UPDATED };
    }


    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.findOneById(id);
        if (!user) throw new NotFoundException(messagesConstant.USER_NOT_FOUND);

        await this.usersService.remove(id);
        return { message: messagesConstant.USER_DELETED };
    }
}

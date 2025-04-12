import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { messagesConstant } from '../../common/constants/messages.constant';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Blog')
@ApiBearerAuth()
@Controller('blog')
export class BlogController {
  usersService: any;
  constructor(
    private readonly blogService: BlogService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({ status: 201, description: 'Blog created' })
  create(@Request() req, @Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(req.user.id, createBlogDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all blogs (public)' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.blogService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get blogs by current user' })
  findMyBlogs(@Request() req) {
    return this.blogService.findUserBlogs(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single blog post (public)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findOneById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateBlogDto,
    @Request() req,
  ) {
    await this.blogService.update(id, updateUserDto);
    return { message: messagesConstant.BLOG_UPDATED };
  }
}

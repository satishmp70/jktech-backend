import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from 'src/common/decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Blog') 
@ApiBearerAuth()
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

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
}

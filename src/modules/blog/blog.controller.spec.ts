import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { messagesConstant } from '../../common/constants/messages.constant';

describe('BlogController', () => {
  let controller: BlogController;
  let blogService: BlogService;

  const mockBlogService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findUserBlogs: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [
        {
          provide: BlogService,
          useValue: mockBlogService,
        },
      ],
    }).compile();

    controller = module.get<BlogController>(BlogController);
    blogService = module.get<BlogService>(BlogService);
  });

  describe('create', () => {
    it('should create a blog for user', async () => {
      const dto: CreateBlogDto = { title: 'Test', content: 'Test content' };
      const req = { user: { id: 1 } };

      mockBlogService.create.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.create(req, dto);

      expect(blogService.create).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('should return all blogs', async () => {
      const blogs = [{ id: 1 }, { id: 2 }];
      mockBlogService.findAll.mockResolvedValue(blogs);

      const result = await controller.findAll();
      expect(result).toEqual(blogs);
      expect(blogService.findAll).toHaveBeenCalled();
    });
  });

  describe('findMyBlogs', () => {
    it('should return blogs by user ID', async () => {
      const blogs = [{ id: 1, userId: 1 }];
      const req = { user: { id: 1 } };
      mockBlogService.findUserBlogs.mockResolvedValue(blogs);

      const result = await controller.findMyBlogs(req);
      expect(result).toEqual(blogs);
      expect(blogService.findUserBlogs).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a blog by ID', async () => {
      const blog = { id: 1, title: 'Test' };
      mockBlogService.findOneById.mockResolvedValue(blog);

      const result = await controller.findOne(1);
      expect(result).toEqual(blog);
      expect(blogService.findOneById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a blog and return message', async () => {
      const dto: UpdateBlogDto = { title: 'Updated', content: 'Updated content' };
      const req = { user: { id: 1 } };
      mockBlogService.update.mockResolvedValue(undefined);

      const result = await controller.update(1, dto, req);

      expect(blogService.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ message: messagesConstant.BLOG_UPDATED });
    });
  });
});

import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @ApiPropertyOptional({ example: 'Updated blog title' })
  title?: string;

  @ApiPropertyOptional({ example: 'Updated blog content' })
  content?: string;
}

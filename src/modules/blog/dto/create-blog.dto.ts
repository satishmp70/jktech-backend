import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ example: 'My first blog' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'This is the content of the blog.' })
  @IsNotEmpty()
  @IsString()
  content: string;
}

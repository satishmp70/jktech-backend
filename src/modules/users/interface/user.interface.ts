import { CreateBlogDto } from "src/modules/blog/dto/create-blog.dto";

export interface UserInterface {
    id(id: any, createBlogDto: CreateBlogDto): unknown;
    title: string;
    content: string;
  }
  
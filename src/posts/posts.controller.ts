import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDocument } from './entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async findAll(): Promise<PostDocument[]> {
    return this.postService.findAll();
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostDocument> {
    return this.postService.createPost(createPostDto);
  }
}

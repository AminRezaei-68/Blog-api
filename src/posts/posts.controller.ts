import { Body, Controller, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDocument } from './entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostDocument> {
    return this.postService.createPost(createPostDto);
  }
}

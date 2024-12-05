import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity, PostDocument } from './entities/post.entity';
import { PaginationQueryDto } from 'src/common/dto/Pagination-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { title } from 'process';
import { query } from 'express';
import { PostQuery } from 'src/common/interfaces/post-query.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get('filter')
  getPosts(@Query() query: PostQuery): Promise<PostDocument[]> {
    console.log('hit filter');
    return this.postService.filteredPosts(query);
  }

  @Get()
  findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<PostDocument[]> {
    return this.postService.findAll(paginationQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostEntity> {
    return this.postService.findOne(id);
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto): Promise<PostDocument> {
    return this.postService.createPost(createPostDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostDocument> {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}

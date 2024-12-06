import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity, PostDocument } from './entities/post.entity';
import { PaginationQueryDto } from 'src/common/dto/Pagination-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQuery } from 'src/common/interfaces/post-query.interface';
import { ApiKeyGuard } from 'src/common/guards/api-key/api-key.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { PostOwnershipGuard } from 'src/common/guards/post-ownership/post-ownership.guard';

@Controller('posts')
@UseGuards(ApiKeyGuard)
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get('filter')
  @Public()
  getPosts(@Query() query: PostQuery): Promise<PostDocument[]> {
    return this.postService.filteredPosts(query);
  }

  @Get()
  @Public()
  findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<PostDocument[]> {
    return this.postService.findAll(paginationQueryDto);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string): Promise<PostEntity> {
    return this.postService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: CreatePostDto): Promise<PostDocument> {
    return this.postService.createPost(createPostDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PostOwnershipGuard)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostDocument> {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PostOwnershipGuard)
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.postService.remove(id);
  }
}

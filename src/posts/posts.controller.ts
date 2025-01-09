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
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDocument } from './schemas/post.schema';
import { PaginationQueryDto } from 'src/common/dto/Pagination-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQuery } from '../common/interfaces/post-query.interface';
import { ApiKeyGuard } from '../common/guards/api-key/api-key.guard';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { PostOwnershipGuard } from '../common/guards/post-ownership/post-ownership.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';

@Controller('posts')
@UseGuards(ApiKeyGuard)
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get('filter')
  @Public()
  getPosts(
    @Query() query: PostQuery,
    @Body() paginationQuaryDto: PaginationQueryDto,
  ): Promise<PostDocument[]> {
    return this.postService.filteredPosts(query, paginationQuaryDto);
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
  findOne(@Param('id') id: string): Promise<PostDocument> {
    return this.postService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: any,
  ): Promise<PostDocument> {
    const author = req.user.name;
    return this.postService.createPost(createPostDto, author);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PostOwnershipGuard, RolesGuard)
  @Roles('user', 'admin')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostDocument> {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PostOwnershipGuard, RolesGuard)
  @Roles('user', 'admin')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.postService.remove(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostEntity, PostDocument } from './entities/post.entity';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationQueryDto } from 'src/common/dto/Pagination-query.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostEntity.name) private postModule: Model<PostDocument>,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<PostDocument> {
    const { title, content, author } = createPostDto;
    const newPost = new this.postModule({ title, content, author });
    return newPost.save();
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<PostDocument[]> {
    const { limit, offset } = paginationQueryDto;
    return this.postModule.find({ skip: offset, take: limit });
  }

  async findOne(id: string): Promise<PostEntity> {
    const post = await this.postModule.findById(id);
    if (!post) {
      throw new NotFoundException(`The post with id ${id} not found.`);
    }
    return post;
  }
}

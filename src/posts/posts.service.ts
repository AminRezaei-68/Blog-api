import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostEntity, PostDocument } from './entities/post.entity';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationQueryDto } from 'src/common/dto/Pagination-query.dto';
import { PostQuery } from 'src/common/interfaces/post-query.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostEntity.name) private postModel: Model<PostDocument>,
  ) {}

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<PostDocument[]> {
    const { limit, offset } = paginationQueryDto;
    return this.postModel.find({ skip: offset, take: limit });
  }

  async findOne(id: string): Promise<PostEntity> {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException(`The post with id ${id} not found.`);
    }
    return post;
  }

  async filteredPosts(query: PostQuery): Promise<PostDocument[]> {
    const queryFilter: any = {};

    if (query.title) {
      queryFilter.title = { $regex: query.title, $options: 'i' };
    }

    if (query.author) {
      queryFilter.author = { $regex: query.author, $options: 'i' };
    }

    if (query.content) {
      queryFilter.content = { $regex: query.content, $options: 'i' };
    }

    return this.postModel.find(queryFilter).exec();
  }

  async createPost(createPostDto: CreatePostDto): Promise<PostDocument> {
    const newPost = new this.postModel(createPostDto);
    return newPost.save();
  }

  async updatePost(id, updatePostDto): Promise<PostDocument> {
    const updatedPost = await this.postModel.findByIdAndUpdate(
      id,
      updatePostDto,
      { new: true },
    );
    if (!updatedPost) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }
    return updatedPost;
  }

  async remove(id: string): Promise<{ message: string }> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format.');
    }
    const result = await this.postModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    return { message: `Post with ID "${id}" successfully deleted.` };
  }
}

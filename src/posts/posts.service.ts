import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostEntity, PostDocument } from './entities/post.entity';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';

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

  async findAll(): Promise<PostDocument[]> {
    return this.postModule.find();
  }

  async findOne(id: string): Promise<PostEntity> {
    const post = await this.postModule.findById(id);
    console.log(post);
    if (!post) {
      throw new NotFoundException(`The post with id ${id} not found.`);
    }
    return post;
  }
}

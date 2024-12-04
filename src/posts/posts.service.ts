import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModule: Model<PostDocument>,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<PostDocument> {
    const { title, content, author } = createPostDto;
    const newPost = new this.postModule({ title, content, author });
    return newPost.save();
  }
}

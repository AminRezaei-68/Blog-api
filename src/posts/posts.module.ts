import { forwardRef, Module, Post } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema, PostSch } from './schemas/post.schema';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PostSch.name, schema: PostSchema }]),
    forwardRef(() => UsersModule),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}

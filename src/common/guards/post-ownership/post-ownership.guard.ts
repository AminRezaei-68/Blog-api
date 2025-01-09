import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PostsService } from '../../../posts/posts.service';

@Injectable()
export class PostOwnershipGuard implements CanActivate {
  constructor(private readonly postsService: PostsService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const postId = request.params.id;
    const author = request.user.name;

    return this.postsService.findOne(postId).then((post) => {
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      return post.author === author;
    });
  }
}

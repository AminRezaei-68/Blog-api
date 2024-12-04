import { IsString, IsNotEmpty } from '@nestjs/class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsNotEmpty()
  author: string;
}

import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Title must not exceed 100 characters.' })
  title: string;

  @IsString()
  @MinLength(10, { message: 'Content must be at least 10 characters long.' })
  content: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Author name must not exceed 50 characters.' })
  author: string;
}

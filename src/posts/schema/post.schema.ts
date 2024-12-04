import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop({ required: true })
  author: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

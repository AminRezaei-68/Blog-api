import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PostSch {
  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop({ required: true })
  author: string;
}

export type PostDocument = PostSch & Document;

export const PostSchema = SchemaFactory.createForClass(PostSch);

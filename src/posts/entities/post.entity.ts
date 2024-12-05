import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = PostEntity & Document;

@Schema({ timestamps: true })
export class PostEntity {
  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop({ required: true })
  author: string;
}

export const PostSchema = SchemaFactory.createForClass(PostEntity);

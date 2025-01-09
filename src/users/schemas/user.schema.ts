import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: [String], default: ['user'] })
  roles: string[];

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  isActive: boolean;
}

export type UserDocument = User & Document;

export const userSchema = SchemaFactory.createForClass(User);

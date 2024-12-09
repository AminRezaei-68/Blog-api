import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  role: string;

  @Prop({ required: true })
  password: string;
}

export type UserDocument = User & Document;

export const userEntity = SchemaFactory.createForClass(User);

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.schemas';
import { Transform } from 'class-transformer';

@Schema()
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiver: User;

  @Prop({ required: true })
  @Transform(({ value }) => value.toString().trim())
  content: string;

  @Prop({ default: false })
  is_read: boolean;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: null })
  updated_at: Date;

  @Prop({ default: null })
  deleted_at: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

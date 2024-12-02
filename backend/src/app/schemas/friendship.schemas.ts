import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schemas';
import { Types } from 'mongoose';

@Schema()
export class Friendship {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  initiator: User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recipient: User;

  @Prop({ required: true })
  status: string;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const FriendshipSchema = SchemaFactory.createForClass(Friendship);

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refresh_token: string;

  @Prop({ default: false })
  is_online: boolean;

  @Prop({ default: new Date() })
  last_seen: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

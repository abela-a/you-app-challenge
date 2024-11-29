import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Gender } from '../enums/gender.enum';
import { User } from './user.schemas';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: User;

  @Prop({ required: true })
  name: string;

  @Prop()
  photo: string;

  @Prop()
  about: string;

  @Prop({ enum: Gender })
  gender: Gender;

  @Prop({ required: true })
  birthday: Date;

  @Prop()
  horoscope: string;

  @Prop()
  zodiac: string;

  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop([String])
  interests: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Gender } from '../enums/gender.enum';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @Prop({ required: true, unique: true })
  user_id: string;

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

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Zodiac {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  end_date: Date;
}

export const ZodiacSchema = SchemaFactory.createForClass(Zodiac);

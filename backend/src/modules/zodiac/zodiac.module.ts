import { Module } from '@nestjs/common';
import { ZodiacService } from './zodiac.service';
import { ZodiacController } from './zodiac.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Zodiac, ZodiacSchema } from '../../app/schemas/zodiac.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Zodiac.name, schema: ZodiacSchema }]),
  ],
  providers: [ZodiacService],
  controllers: [ZodiacController],
  exports: [ZodiacService],
})
export class ZodiacModule {}

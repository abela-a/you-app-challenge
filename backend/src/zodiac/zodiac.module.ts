import { Module } from '@nestjs/common';
import { ZodiacService } from './zodiac.service';
import { ZodiacController } from './zodiac.controller';

@Module({
  providers: [ZodiacService],
  controllers: [ZodiacController],
  exports: [ZodiacService],
})
export class ZodiacModule {}

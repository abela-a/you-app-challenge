import { Module } from '@nestjs/common';
import { HoroscopeService } from './horoscope.service';
import { HoroscopeController } from './horoscope.controller';

@Module({
  providers: [HoroscopeService],
  controllers: [HoroscopeController],
  exports: [HoroscopeService],
})
export class HoroscopeModule {}

import { Injectable } from '@nestjs/common';
import { HoroscopeDto } from './dto/horoscope.dto';
import * as horoscopes from './horoscope.data.json';

@Injectable()
export class HoroscopeService {
  private horoscopes: HoroscopeDto[] = horoscopes;

  getHoroscopes(): HoroscopeDto[] {
    return this.horoscopes;
  }

  getHoroscopeByName(name: string): HoroscopeDto {
    return this.horoscopes.find(
      (horoscope) => horoscope.name.toLowerCase() === name.toLowerCase(),
    );
  }
}

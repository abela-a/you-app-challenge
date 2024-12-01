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

  getHoroscopeByDate(date: string): HoroscopeDto {
    const targetDate = new Date(date);

    return this.horoscopes.find(
      (horoscope) =>
        new Date(`${targetDate.getFullYear()}-${horoscope.start_date}`) <=
          targetDate &&
        new Date(`${targetDate.getFullYear()}-${horoscope.end_date}`) >=
          targetDate,
    );
  }
}

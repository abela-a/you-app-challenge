import { Injectable } from '@nestjs/common';
import { ZodiacDto } from './dto/zodiac.dto';
import * as zodiacs from './zodiac.data.json';

@Injectable()
export class ZodiacService {
  private zodiacs: ZodiacDto[] = zodiacs;

  getZodiacs(): ZodiacDto[] {
    return this.zodiacs.map((zodiac) => ({
      ...zodiac,
      start_date: new Date(zodiac.start_date).toISOString().split('T')[0],
      end_date: new Date(zodiac.end_date).toISOString().split('T')[0],
    }));
  }

  getZodiacByName(name: string): ZodiacDto[] {
    return this.zodiacs
      .filter((zodiac) => zodiac.name.toLowerCase() === name.toLowerCase())
      .map((zodiac) => ({
        ...zodiac,
        start_date: new Date(zodiac.start_date).toISOString().split('T')[0],
        end_date: new Date(zodiac.end_date).toISOString().split('T')[0],
      }));
  }

  getZodiacsByDateRange(startDate: string, endDate: string): ZodiacDto[] {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.zodiacs.filter(
      (zodiac) =>
        new Date(zodiac.start_date) >= start &&
        new Date(zodiac.end_date) <= end,
    );
  }
}

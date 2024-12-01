import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { HoroscopeService } from './horoscope.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ApiOperation, ApiSecurity } from '@nestjs/swagger';

@Controller('horoscopes')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class HoroscopeController {
  constructor(private readonly horoscopeService: HoroscopeService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Horoscopes',
    description: 'Get all horoscopes',
    responses: {
      200: { description: 'The horoscopes have been successfully found' },
      401: { description: 'Unauthorized' },
    },
  })
  async getHoroscopes() {
    return await this.horoscopeService.getHoroscopes();
  }

  @Get(':name')
  @ApiOperation({
    summary: 'Get Horoscope by Name',
    description: 'Get a horoscope by its name',
    responses: {
      200: { description: 'The horoscope has been successfully found' },
      400: { description: 'Invalid Name' },
      401: { description: 'Unauthorized' },
      404: { description: 'Horoscope not found' },
    },
  })
  async getHoroscopeById(@Param('name') name: string) {
    return await this.horoscopeService.getHoroscopeByName(name);
  }
}

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ZodiacService } from './zodiac.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ApiOperation, ApiSecurity } from '@nestjs/swagger';

@Controller('zodiacs')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class ZodiacController {
  constructor(private readonly zodiacService: ZodiacService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Zodiacs',
    description: 'Get all zodiacs',
    responses: {
      200: { description: 'The zodiacs have been successfully found' },
      401: { description: 'Unauthorized' },
    },
  })
  async getZodiacs() {
    return await this.zodiacService.getZodiacs();
  }

  @Get(':name')
  @ApiOperation({
    summary: 'Get Zodiac by Name',
    description: 'Get a zodiac by its name',
    responses: {
      200: { description: 'The zodiac has been successfully found' },
      400: { description: 'Invalid Name' },
      401: { description: 'Unauthorized' },
      404: { description: 'Zodiac not found' },
    },
  })
  async getZodiacById(@Param('name') name: string) {
    return await this.zodiacService.getZodiacByName(name);
  }

  @Get('range/:startDate/:endDate')
  @ApiOperation({
    summary: 'Get Zodiacs by Date Range',
    description: 'Get zodiacs within a specific date range',
    responses: {
      200: { description: 'The zodiacs have been successfully found' },
      400: { description: 'Invalid Date Range' },
      401: { description: 'Unauthorized' },
      404: { description: 'Zodiacs not found' },
    },
  })
  async getZodiacsByDateRange(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ) {
    return await this.zodiacService.getZodiacsByDateRange(startDate, endDate);
  }
}

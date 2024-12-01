import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ZodiacService } from './zodiac.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { UpdateZodiacDto } from './dto/update-zodiac.dto';
import { CreateZodiacDto } from './dto/create-zodiac.dto';

@Controller('zodiacs')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class ZodiacController {
  constructor(private readonly zodiacService: ZodiacService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Zodiac',
    description: 'Create a new zodiac with the data provided',
    responses: {
      201: { description: 'The zodiac has been successfully created' },
      401: { description: 'Unauthorized' },
    },
  })
  async createZodiac(@Body() createZodiacDto: CreateZodiacDto) {
    return await this.zodiacService.createZodiac(createZodiacDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Zodiacs',
    description: 'Get all zodiacs',
    parameters: [
      {
        name: 'page',
        in: 'query',
        required: false,
        description: 'Page number',
      },
      {
        name: 'limit',
        in: 'query',
        required: false,
        description: 'Number of zodiacs per page',
      },
    ],
    responses: {
      200: { description: 'The zodiacs have been successfully found' },
      401: { description: 'Unauthorized' },
    },
  })
  async getZodiacs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    await this.zodiacService.initDefaultZodiacs();
    return await this.zodiacService.getZodiacs({ page, limit });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Zodiac by ID',
    description: 'Get a zodiac by its ID',
    parameters: [
      {
        name: 'id',
        description: 'The ID of the zodiac',
        in: 'path',
        required: true,
      },
    ],
    responses: {
      200: { description: 'The zodiac has been successfully found' },
      400: { description: 'Invalid ID' },
      401: { description: 'Unauthorized' },
      404: { description: 'Zodiac not found' },
    },
  })
  async getZodiacById(@Param('id') id: string) {
    return await this.zodiacService.getZodiacById(id);
  }

  @Get('date/:date')
  @ApiOperation({
    summary: 'Get Zodiac by Date',
    description: 'Get a zodiac by a specific date',
    parameters: [
      {
        name: 'date',
        description: 'The date to check',
        in: 'path',
        required: true,
      },
    ],
    responses: {
      200: { description: 'The zodiac has been successfully found' },
      400: { description: 'Invalid Date' },
      401: { description: 'Unauthorized' },
      404: { description: 'Zodiac not found' },
    },
  })
  async getZodiacByDate(@Param('date') date: string) {
    return await this.zodiacService.getZodiacByDate(date);
  }

  @Get('range/:startDate/:endDate')
  @ApiOperation({
    summary: 'Get Zodiacs by Date Range',
    description: 'Get zodiacs within a specific date range',
    parameters: [
      {
        name: 'startDate',
        description: 'The start date of the range',
        in: 'path',
        required: true,
      },
      {
        name: 'endDate',
        description: 'The end date of the range',
        in: 'path',
        required: true,
      },
    ],
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

  @Put(':id')
  @ApiOperation({
    summary: 'Update Zodiac',
    description: 'Update a zodiac by its ID',
    parameters: [
      {
        name: 'id',
        description: 'The ID of the zodiac',
        in: 'path',
        required: true,
      },
    ],
    responses: {
      200: { description: 'The zodiac has been successfully updated' },
      400: { description: 'Invalid ID' },
      401: { description: 'Unauthorized' },
      404: { description: 'Zodiac not found' },
    },
  })
  async updateZodiac(
    @Param('id') id: string,
    @Body() updateZodiacDto: UpdateZodiacDto,
  ) {
    await this.zodiacService.getZodiacById(id);

    return await this.zodiacService.updateZodiac(id, updateZodiacDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Zodiac',
    description: 'Delete a zodiac by its ID',
    parameters: [
      {
        name: 'id',
        description: 'The ID of the zodiac',
        in: 'path',
        required: true,
      },
    ],
    responses: {
      200: { description: 'The zodiac has been successfully deleted' },
      400: { description: 'Invalid ID' },
      401: { description: 'Unauthorized' },
      404: { description: 'Zodiac not found' },
    },
  })
  async deleteZodiac(@Param('id') id: string) {
    await this.zodiacService.getZodiacById(id);
    await this.zodiacService.deleteZodiac(id);
    return;
  }
}

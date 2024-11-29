import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HoroscopeDto {
  @IsString()
  @ApiProperty({
    required: true,
    example: 'aries',
    description: 'The code of the horoscope',
  })
  readonly code: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: 'Aries',
    description: 'The name of the horoscope',
  })
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'Ram',
    description: 'The alternative name of the horoscope',
  })
  readonly name_alt?: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: '03-21',
    description: 'The start date of the horoscope',
  })
  readonly start_date: string; // Format: MM-DD

  @IsString()
  @ApiProperty({
    required: true,
    example: '04-19',
    description: 'The end date of the horoscope',
  })
  readonly end_date: string; // Format: MM-DD
}

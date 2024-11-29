import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ZodiacDto {
  @IsString()
  @ApiProperty({
    required: true,
    example: 'Dragon',
    description: 'The name of the zodiac',
  })
  readonly name: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: '2012-01-23',
    description: 'The start date of the zodiac',
  })
  readonly start_date: string; // Format: MM-DD

  @IsString()
  @ApiProperty({
    required: true,
    example: '2013-02-09',
    description: 'The end date of the zodiac',
  })
  readonly end_date: string;
}

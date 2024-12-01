import { IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateZodiacDto {
  @IsString()
  @ApiProperty({
    required: true,
    example: 'Dragon',
    description: 'The name of the zodiac',
  })
  readonly name: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    required: true,
    example: '2012-01-23',
    description: 'The start date of the zodiac',
  })
  readonly start_date: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    required: true,
    example: '2013-02-09',
    description: 'The end date of the zodiac',
  })
  readonly end_date: string;
}

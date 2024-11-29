import {
  IsString,
  IsEnum,
  IsDate,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../enums/gender.enum';
import { Transform, Type } from 'class-transformer';

export class CreateProfileDto {
  @IsOptional()
  @ApiProperty({
    required: false,
    example: '',
    default: '',
    description: 'The user ID of the profile. Auto-generated from the token',
    nullable: true,
  })
  user_id?: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: 'Abel A Simanungkalit',
    description: 'The name of the profile',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'https://example.com/photo.jpg',
    description: 'The photo of the profile',
    format: 'binary',
  })
  photo?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'Another developer from "Kota Daeng"',
    description: 'The about of the profile',
  })
  about?: string;

  @IsOptional()
  @IsEnum(Gender)
  @ApiProperty({
    required: false,
    example: Gender.MALE,
    description: 'The gender of the profile',
    enum: Gender,
  })
  gender?: Gender;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    required: true,
    example: '2002-05-05',
    description: 'The birthday of the profile',
  })
  birthday: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'taurus',
    description: 'The horoscope of the profile',
  })
  horoscope?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'horse',
    description: 'The zodiac of the profile',
  })
  zodiac?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    required: false,
    example: 160,
    description: 'The height of the profile',
  })
  height?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    required: false,
    example: 55,
    description: 'The weight of the profile',
  })
  weight?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
  @ApiProperty({
    required: false,
    example: ['reading', 'listening to music', 'running'],
    description: 'The interests of the profile',
  })
  interests?: string[];
}

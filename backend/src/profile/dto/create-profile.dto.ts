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

export class CreateProfileDto {
  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiProperty({ enum: Gender, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty()
  @IsDate()
  birthday: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  horoscope?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  zodiac?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  interests?: string[];
}

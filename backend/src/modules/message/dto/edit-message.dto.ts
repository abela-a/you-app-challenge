import { PartialType } from '@nestjs/mapped-types';
import { SendMessageDto } from './send-message.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditMessageDto extends PartialType(SendMessageDto) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: 'Hi! Nice to meet you :)',
    default: '',
    description: 'The content of the message',
  })
  content: string;
}

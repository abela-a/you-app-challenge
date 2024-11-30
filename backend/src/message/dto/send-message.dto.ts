import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    required: false,
    example: '',
    default: '',
    description: 'The sender of the message',
    nullable: true,
  })
  sender: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: '',
    default: '',
    description: 'The receiver of the message',
  })
  receiver: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: 'Hello from the other side :)',
    default: '',
    description: 'The content of the message',
  })
  content: string;
}

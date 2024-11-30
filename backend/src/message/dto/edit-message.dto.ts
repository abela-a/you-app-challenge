import { PartialType } from '@nestjs/mapped-types';
import { SendMessageDto } from './send-message.dto';

export class EditMessageDto extends PartialType(SendMessageDto) {
  id: number;
}

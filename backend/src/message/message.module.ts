import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message, MessageSchema } from '../app/schemas/message.schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}

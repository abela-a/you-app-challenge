import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message, MessageSchema } from '../../app/schemas/message.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageController } from './message.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [MessageService],
  exports: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}

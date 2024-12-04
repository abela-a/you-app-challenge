import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message, MessageSchema } from '../../app/schemas/message.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageController } from './message.controller';
import { NotificationModule } from '../notification/notification.module';
import {
  Friendship,
  FriendshipSchema,
} from '../../app/schemas/friendship.schemas';
import { MessageGateway } from './message.gateway';
import { GatewayModule } from '../../gateway/gateway.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: Friendship.name, schema: FriendshipSchema },
    ]),
    NotificationModule,
    GatewayModule,
  ],
  providers: [MessageService, MessageGateway],
  exports: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}

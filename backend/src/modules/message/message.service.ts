import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../../app/schemas/message.schemas';
import { SendMessageDto } from './dto/send-message.dto';
import { EditMessageDto } from './dto/edit-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { NotificationService } from '../notification/notification.service';
import { Friendship } from '../../app/schemas/friendship.schemas';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Friendship.name) private friendshipModel: Model<Friendship>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly notificationService: NotificationService,
  ) {}

  async sendMessage(sendMessageDto: SendMessageDto) {
    const checkFriendship = await this.friendshipModel.findOne({
      $or: [
        { initiator: sendMessageDto.sender },
        { recipient: sendMessageDto.sender },
      ],
      status: 'accepted',
    });

    if (!checkFriendship) {
      throw new BadRequestException('Friendship not found');
    }

    const messageStore = new this.messageModel(sendMessageDto);
    const message = await messageStore.save();

    this.notificationService.publishMessage(
      'notification.new_message',
      message,
    );

    return message;
  }

  async getMessages(params: GetMessagesDto) {
    return this.messageModel
      .find({
        $or: [
          { sender: params.sender, receiver: params.receiver },
          { sender: params.receiver, receiver: params.sender },
        ],
        deleted_at: null,
      })
      .sort({ createdAt: -1 })
      .skip((params.page - 1) * params.limit)
      .limit(params.limit);
  }

  async markAsRead(messageId: string) {
    return this.messageModel.findByIdAndUpdate(messageId, { isRead: true });
  }

  async markAllAsRead(receiver: string) {
    return this.messageModel.updateMany(
      { receiver, isRead: false },
      { isRead: true },
    );
  }

  async editMessage(messageId: string, editMessageDto: EditMessageDto) {
    return this.messageModel.findByIdAndUpdate(messageId, editMessageDto, {
      new: true,
    });
  }

  async deleteMessage(messageId: string) {
    return this.messageModel.findByIdAndUpdate(messageId, {
      deleted_at: Date.now(),
    });
  }

  async deleteMessages(sender: string, receiver: string) {
    return this.messageModel.updateMany(
      {
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      },
      { deleted_at: Date.now() },
    );
  }
}

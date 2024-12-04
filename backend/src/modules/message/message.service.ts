import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../../app/schemas/message.schemas';
import { SendMessageDto } from './dto/send-message.dto';
import { EditMessageDto } from './dto/edit-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';

@Injectable()
export class MessageService {
  constructor(@InjectModel('Message') private messageModel: Model<Message>) {}

  async sendMessage(sendMessageDto: SendMessageDto) {
    return new this.messageModel(sendMessageDto).save();
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

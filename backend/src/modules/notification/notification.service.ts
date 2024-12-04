import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy {
  constructor(private notificationGateway: NotificationGateway) {}

  private connection: amqp.AmqpConnectionManager;
  private channel: amqp.ChannelWrapper;

  async onModuleInit() {
    this.connection = amqp.connect([process.env.RABBITMQ_URL]);

    this.createChannel();
    this.consumeMessage();
  }

  async createChannel() {
    this.channel = this.connection.createChannel({
      json: true,
      setup: async (channel) => {
        await channel.assertExchange('notification', 'topic', {
          durable: true,
        });

        await channel.assertQueue('notification_queue', { durable: true });

        await channel.bindQueue(
          'notification_queue',
          'notification',
          'notification.*',
        );
      },
    });
  }

  async consumeMessage() {
    this.channel.consume('notification_queue', (msg) => {
      if (msg) {
        let isSuccess = false;
        let userId = null;

        const content = JSON.parse(msg.content.toString());
        const type = msg.fields.routingKey.replace('notification.', '');

        const notification = {
          message: '',
          type: type,
          data: content,
        };

        switch (type) {
          case 'friend_request':
            userId = content.recipient;
            notification.message = 'You have a new friend request';
            break;
          case 'request_accepted':
            userId = content.initiator;
            notification.message = 'Your friend request has been accepted';
            break;
          case 'new_message':
            userId = content.receiver;
            notification.message = 'You have a new message';
            break;
          default:
            notification.message = 'New notification';
            break;
        }

        const emited = this.notificationGateway.emitNotification(
          userId,
          notification,
        );
        isSuccess = emited.success;

        if (isSuccess) {
          this.channel.ack(msg);
        } else {
          this.channel.nack(msg, false, true);
        }
      }
    });
  }

  async publishMessage(routingKey: string, message: any) {
    this.channel.publish('notification', routingKey, message);
  }

  async onModuleDestroy() {
    await this.connection.close();
  }
}

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
        const content = JSON.parse(msg.content.toString());
        let isSuccess = false;

        if (msg.fields.routingKey === 'notification.friend_request') {
          const notification =
            this.notificationGateway.sendFriendRequestNotification(content);

          isSuccess = notification.success;
        }

        if (msg.fields.routingKey === 'notification.request_accepted') {
          const notification =
            this.notificationGateway.sendRequestAcceptedNotification(content);

          isSuccess = notification.success;
        }

        if (isSuccess) {
          this.channel.ack(msg);
        } else {
          this.channel.nack(msg, false, true);
        }
      }
    });
  }

  async publishMessage(routingKey: string, message: any) {
    await this.channel.publish('notification', routingKey, message);
  }

  async onModuleDestroy() {
    await this.connection.close();
  }
}

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Friendship } from '../../app/schemas/friendship.schemas';
import { GatewayService } from '../../gateway/gateway.service';

const PORT = parseInt(process.env.SOCKET_PORT) || 3000;

@WebSocketGateway(PORT, { namespace: 'notification', cors: '*' })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly gatewayService: GatewayService) {}

  @WebSocketServer() server: Server;

  afterInit() {
    console.info(`Gateway - Notification initialized on ${PORT}/notification`);
  }

  async handleConnection(client: Socket) {
    const userId = await this.gatewayService.handleConnection(
      client,
      this.server,
    );

    client.join(`notification.${userId}`);
  }

  async handleDisconnect(client: Socket) {
    const userId = this.gatewayService.handleDisconnect(client);

    client.leave(`notification.${userId}`);
  }

  sendFriendRequestNotification(friendship: Friendship) {
    const notification = {
      message: 'You have a new friend request',
      data: friendship,
    };

    try {
      this.server
        .to(`notification.${friendship.recipient}`)
        .emit('friendship.notification.friend-request', notification);

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  sendRequestAcceptedNotification(friendship: Friendship) {
    const notification = {
      message: 'Your friend request has been accepted',
      data: friendship,
    };

    try {
      this.server
        .to(`notification.${friendship.initiator}`)
        .emit('friendship.notification.request-accepted', notification);

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}

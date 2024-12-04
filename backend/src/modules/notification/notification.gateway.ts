import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayService } from '../../gateway/gateway.service';

const PORT = parseInt(process.env.SOCKET_PORT) || 3000;

@WebSocketGateway(PORT, { cors: '*' })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly gatewayService: GatewayService) {}

  @WebSocketServer() server: Server;

  afterInit() {}

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

  emitNotification(userId: string, notification: any) {
    try {
      this.server
        .to(`notification.${userId}`)
        .emit('notification', notification);

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}

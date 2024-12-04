import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayService } from '../../gateway/gateway.service';
import { MessageService } from './message.service';

const PORT = parseInt(process.env.SOCKET_PORT) || 3000;

@WebSocketGateway(PORT, { cors: '*' })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly messageService: MessageService,
  ) {}

  @WebSocketServer() server: Server;

  afterInit() {}

  async handleConnection(client: Socket) {
    const userId = await this.gatewayService.handleConnection(
      client,
      this.server,
    );

    client.join(`message.${userId}`);
  }

  async handleDisconnect(client: Socket) {
    const userId = this.gatewayService.handleDisconnect(client);

    client.leave(`message.${userId}`);
  }

  @SubscribeMessage('chat:typingStart')
  handleTypingStart(
    client: Socket,
    @MessageBody() data: { sender: string; receiver: string },
  ) {
    const { sender, receiver } = data;
    this.server.to(`message.${receiver}`).emit('typing.start', { sender });
  }

  @SubscribeMessage('chat:typingStop')
  handleTypingStop(
    client: Socket,
    @MessageBody() data: { sender: string; receiver: string },
  ) {
    const { sender, receiver } = data;
    this.server.to(`message.${receiver}`).emit('typing.stop', { sender });
  }

  @SubscribeMessage('chat:sendMessage')
  async handleSendMessage(
    client: Socket,
    @MessageBody() data: { sender: string; receiver: string; content: string },
  ) {
    const { sender, receiver, content } = data;

    const message = await this.messageService.sendMessage({
      sender,
      receiver,
      content,
    });

    this.server.to(`message.${receiver}`).emit('message.new', message);
  }

  @SubscribeMessage('chat:messageRead')
  async handleMessageRead(
    client: Socket,
    @MessageBody() data: { messageId: string; receiver: string },
  ) {
    const { messageId, receiver } = data;

    const message = await this.messageService.markAsRead(messageId);

    this.server
      .to(`message.${message.sender}`)
      .emit('message.readed', { messageId, reader: receiver });
  }

  @SubscribeMessage('chat:messageReadAll')
  async handleMessageReadAll(
    client: Socket,
    @MessageBody() data: { receiver: string },
  ) {
    const { receiver } = data;

    await this.messageService.markAllAsRead(receiver);

    this.server.to(`message.${receiver}`).emit('message.readedAll');
  }

  @SubscribeMessage('chat:editMessage')
  async handleEditMessage(
    client: Socket,
    @MessageBody() data: { messageId: string; content: string },
  ) {
    const { messageId, content } = data;

    const message = await this.messageService.editMessage(messageId, {
      content,
    });

    this.server
      .to(`message.${message.receiver}`)
      .emit('message.edited', { messageId, content });
  }

  @SubscribeMessage('chat:deleteMessage')
  async handleDeleteMessage(
    client: Socket,
    @MessageBody() data: { messageId: string },
  ) {
    const { messageId } = data;

    const message = await this.messageService.deleteMessage(messageId);

    this.server
      .to(`message.${message.receiver}`)
      .emit('message.deleted', { messageId });
  }
}

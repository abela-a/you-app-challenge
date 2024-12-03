import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../modules/user/user.service';
import { Socket, Server } from 'socket.io';

@Injectable()
export class GatewayService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async handleConnection(client: Socket, server: Server) {
    const token = Array.isArray(client.handshake.query.token)
      ? client.handshake.query.token[0]
      : client.handshake.query.token;

    if (!token) {
      server.emit('error', 'Unauthorized');
      client.disconnect();

      return false;
    }

    const verifiedToken = await this.verifyToken(token);
    if (!verifiedToken) {
      server.emit('error', 'Unauthorized');
      client.disconnect();

      return false;
    }

    const userId = verifiedToken._id.toString();

    client.join(`user.${userId}`);

    this.broadcastOnlineStatus(userId, server);
    this.userService.updateLastSeen(userId);
    this.userService.updateOnlineStatus(userId, true);

    return userId;
  }

  handleDisconnect(client: Socket) {
    const userId = Array.isArray(client.handshake.query.user_id)
      ? client.handshake.query.user_id[0]
      : client.handshake.query.user_id;

    if (userId) {
      client.leave(`user.${userId}`);

      this.userService.updateLastSeen(userId);
      this.userService.updateOnlineStatus(userId, false);
    }

    return userId;
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) return null;

      const user = await this.userService.getUserById(payload.sub);
      if (!user) return null;

      return user;
    } catch {
      return null;
    }
  }

  async broadcastOnlineStatus(userId: string, server: Server) {}
}

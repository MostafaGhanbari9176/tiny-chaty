import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationGuard } from './notification.guard';
import { IdentifierDTO } from 'src/auth/auth.dto';
import { ChatsService } from 'src/chats/chats.service';

@WebSocketGateway({ path: "/notification", cors: { origin: "*" } })
export class NotificationGateway implements OnGatewayConnection {

  @WebSocketServer()
  server: Server

  constructor(private readonly chatService: ChatsService) { }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`new socket connection: ${JSON.stringify(client.handshake.auth)}`)
  }

  @UseGuards(NotificationGuard)
  @SubscribeMessage('new')
  private async handleMessage(@ConnectedSocket() client: any, payload: any): Promise<void> {

    const identifier = client["identifier"] as IdentifierDTO

    const chatsName = await this.chatService.getUserChatsName(identifier.userId)

    const socket = client as Socket

    socket.join(chatsName)

  }

  getServer(): Server { return this.server }

}



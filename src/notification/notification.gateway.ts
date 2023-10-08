import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationGuard } from './notification.guard';
import { IdentifierDTO } from 'src/auth/auth.dto';
import { ChatsService } from 'src/chats/chats.service';
import { Message, MessageSaveObserver } from 'src/messages/message.schema';

@WebSocketGateway({ path: "/notification", cors: { origin: "*" } })
export class NotificationGateway implements OnGatewayConnection {

  @WebSocketServer()
  server: Server

  constructor(private readonly chatService: ChatsService) {

    this.enableNewMessageHook()

  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`new socket connection: ${JSON.stringify(client.handshake.auth)}`)
  }

  @UseGuards(NotificationGuard)
  @SubscribeMessage('new')
  async handleMessage(@ConnectedSocket() client: any, payload: any): Promise<void> {

    const identifier = client["identifier"] as IdentifierDTO

    const chatsId = await this.chatService.getUserChatsId(identifier.userId)

    const chatsIdStrings = chatsId.map(id => id.toString())

    const socket = client as Socket

    socket.join(chatsIdStrings)

  }

  private enableNewMessageHook() {
    MessageSaveObserver.subscribe((message: Message) => {
      console.log(`on subscriber:${JSON.stringify(message)}`)
      console.log(`server is null: ${this.server == null}`)
      this.server?.in(message.chatId.toString()).emit("new", message)
    })
  }
}


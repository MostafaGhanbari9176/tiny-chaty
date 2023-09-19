import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationGuard } from './notification.guard';

@UseGuards(NotificationGuard)
@WebSocketGateway({ path: "/notification", cors: { origin: "*" } })
export class NotificationGateway implements OnGatewayConnection{


  handleConnection(client: Socket, ...args: any[]) {
    console.log(`new socket connection: ${client.handshake.auth}`)
  }

  @SubscribeMessage('new')
  handleMessage(@ConnectedSocket() client: any, payload: any): void {

    console.log(`new socket subscribe on "new": ${payload}`)

  }

}

import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  providers: [NotificationGateway],
  imports:[ChatsModule],
  exports:[NotificationGateway]
})
export class NotificationModule {}

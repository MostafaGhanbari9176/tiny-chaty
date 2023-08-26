import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ChatsService } from 'src/chats/chats.service';
import { ChatsModule } from 'src/chats/chats.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './message.schema';

@Module({
  providers: [MessagesService],
  imports:[
    MongooseModule.forFeature([{name:Message.name, schema:MessageSchema}]),
    ChatsModule
  ]
})
export class MessagesModule {}

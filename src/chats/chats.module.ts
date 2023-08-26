import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './chat.schema';
import { User, UserSchema } from 'src/users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }, {name:User.name, schema:UserSchema}])
  ],
  providers: [ChatsService],
  controllers: [ChatsController],
  exports:[ChatsService]
})
export class ChatsModule { }




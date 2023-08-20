import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './guard/auth.guard';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://root:1234@127.0.0.1:8081/",
      { dbName: "chat" }),
    AuthModule,
    UsersModule,
    ChatsModule,
    MessagesModule
  ],
  providers:[
    {
      provide:"APP_GUARD",
      useClass:AuthGuard
    }
  ]
})
export class AppModule { }

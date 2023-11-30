import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './guard/auth.guard';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationModule } from './notification/notification.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath:"./config/.env" }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          uri: config.get<string>("MONGO_URI") || "",
          dbName: config.get<string>("DATABASE_NAME") || ""
        }
      }
    }),
    AuthModule,
    UsersModule,
    ChatsModule,
    MessagesModule,
    NotificationModule,
  ],
  providers: [
    {
      provide: "APP_GUARD",
      useClass: AuthGuard
    }
  ]
})
export class AppModule { }

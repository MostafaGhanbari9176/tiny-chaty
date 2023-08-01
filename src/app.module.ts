import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://root:1234@127.0.0.1:8081/",
      { dbName: "chat" }),
    AuthModule
  ],
})
export class AppModule { }

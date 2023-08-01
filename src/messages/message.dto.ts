import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongoose";


@Schema()
export class Message{

    @Prop()
    text:string

    @Prop()
    senderId:ObjectId

    @Prop()
    chatId:ObjectId

}


export const MessageSchema = SchemaFactory.createForClass(Message)


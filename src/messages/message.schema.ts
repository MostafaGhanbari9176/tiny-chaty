import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongoose";


@Schema()
export class Message {

    @Prop()
    text: string

    @Prop()
    creator: ObjectId

    @Prop({ index: true })
    chatId: ObjectId

    @Prop({ index: true, default: 1 })
    counter: number

    @Prop()
    createdAt: Date

}

export const MessageSchema = SchemaFactory.createForClass(Message)



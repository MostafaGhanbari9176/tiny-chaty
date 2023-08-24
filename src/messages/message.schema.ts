import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongoose";


@Schema()
export class Message {

    @Prop({ required: true })
    text: string

    @Prop({ required: true })
    creator: ObjectId

    @Prop({ required: true })
    chatId: ObjectId

    @Prop({ default: 1, required: true })
    messageNumber: number

    @Prop({ required: true })
    createdAt: Date

    @Prop({ required: false })
    parentMessage: ObjectId

}

export const MessageSchema = SchemaFactory.createForClass(Message)

MessageSchema.index({ chatId: 1, counter: -1 }, { unique: true })



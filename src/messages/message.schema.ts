import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, STATES, SchemaTypes } from "mongoose";


@Schema()
export class Message {

    @Prop({ required: true })
    text: string

    @Prop({ type: SchemaTypes.ObjectId, required: true })
    creator: ObjectId

    @Prop({ type: SchemaTypes.ObjectId, required: true })
    chatId: ObjectId

    @Prop({ default: 1, required: true })
    messageNumber: number

    @Prop({ type: Date, required: true })
    createdAt: Date

    @Prop({ type: SchemaTypes.ObjectId, required: false })
    parentMessage: ObjectId

}

export const MessageSchema = SchemaFactory.createForClass(Message)

MessageSchema.index({ chatId: 1, counter: -1 }, { unique: true })



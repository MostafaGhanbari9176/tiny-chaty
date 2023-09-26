import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, STATES, SchemaTypes, Types } from "mongoose";
import { Observable, Subscriber, interval, pipe, publish } from "rxjs";
import { HotObservable } from "rxjs/internal/testing/HotObservable";


@Schema()
export class Message {

    @Prop({ required: true })
    text: string

    @Prop({ type: SchemaTypes.ObjectId, required: true })
    creator: ObjectId

    @Prop({ type: SchemaTypes.ObjectId, required: true })
    chatId: Types.ObjectId

    @Prop({ default: 1, required: true })
    messageNumber: number

    @Prop({ type: Date, required: true })
    createdAt: Date

    @Prop({ type: SchemaTypes.ObjectId, required: false })
    parentMessage: ObjectId

}

export const MessageSchema = SchemaFactory.createForClass(Message)

// export const MessageSaveObserver = new Observable<Message>()

// console.log("second hook attached")
// MessageSchema.post('save', function (message: Message, next) {
//     console.log("second post hook")
//     MessageSaveObserver.pipe()
//     next()
// })


MessageSchema.index({ chatId: 1, counter: -1 }, { unique: false })



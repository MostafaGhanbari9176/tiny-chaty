import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Date, ObjectId, SchemaTypes } from "mongoose";

export enum ChatTypes {
    Channel = "Channel",
    Private = "Private",
    Group = "Group"
}

export class ChatMember {

    member: ObjectId

    lastSawMessage: number = -1

}

@Schema()
export class Chat {

    @Prop({ unique: true })
    name: string

    @Prop()
    title: string

    @Prop({ type: String, required: true, enum: ChatTypes })
    type: ChatTypes

    @Prop({ type: SchemaTypes.ObjectId, required: true })
    creator: ObjectId

    @Prop({ type: Date, required: true })
    createdAt: Date

    @Prop([{ type: ChatMember }])
    members: ChatMember[]

}

export const ChatSchema = SchemaFactory.createForClass(Chat)

ChatSchema.index({ "$members.member": 1 }, { unique: true })

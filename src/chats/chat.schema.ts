import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Date, ObjectId } from "mongoose";

@Schema()
export class Chat{

    @Prop()
    name:string

    @Prop()
    type:string

    @Prop()
    creator:ObjectId

    @Prop()
    createdAt:Date

    @Prop()
    members:ObjectId[]

}

export const ChatSchema = SchemaFactory.createForClass(Chat)

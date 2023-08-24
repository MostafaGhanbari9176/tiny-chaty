import { IsArray, IsEnum, IsMongoId, IsString } from "class-validator"
import { ChatTypes } from "./chat.schema"
import { ObjectId, isValidObjectId } from "mongoose"
import { Type } from "class-transformer"


export class CreateChatDTO {
    @IsString()
    name: string

    @IsString()
    title: string

    @IsEnum(ChatTypes)
    type: ChatTypes
}

export class NewMemberDTO {

    @IsMongoId()
    chatId: ObjectId

    @IsArray()
    @IsMongoId({ each: true })
    newMembers: ObjectId[]

}



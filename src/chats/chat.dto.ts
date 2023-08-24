import { IsArray, IsEnum, IsMongoId, IsString } from "class-validator"
import { ChatTypes } from "./chat.schema"
import { ObjectId, isValidObjectId } from "mongoose"
import { Type } from "class-transformer"


export class CreateChatDTO {
    @IsString()
    id: string

    @IsString()
    name: string

    @IsEnum(ChatTypes)
    type: ChatTypes
}

export class NewMemberDTO {

    @IsString()
    chatId: string

    @IsArray()
    @IsMongoId({ each: true })
    newMembers: ObjectId[]

}



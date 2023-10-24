import { IsArray, IsEnum, IsMongoId, IsString } from "class-validator"
import { ChatTypes } from "./chat.schema"
import { ObjectId, Types, isValidObjectId } from "mongoose"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"


export class CreateChatDTO {
    @IsString()
    name: string

    @IsString()
    title: string

    @IsEnum(ChatTypes)
    @ApiProperty()
    type: ChatTypes
}

export class NewMemberDTO {

    @IsMongoId()
    chatId: ObjectId

    @IsArray()
    @IsMongoId({ each: true })
    newMembers: ObjectId[]

}

export class UserOwnChatListResponseDTO {
    chatId: Types.ObjectId
    name: string
    type: ChatTypes
    title: string
    members: { name: string, family: string, email: string }[]
}

export class UserChatListResponseDTO {
    chatId: Types.ObjectId
    numOfNotSawMessage: number
    abstractText: string
}

export class AbstractMessageDTO {
    chatId: Types.ObjectId
    messageNumber: number
    creator: Types.ObjectId
    abstractText: string
}



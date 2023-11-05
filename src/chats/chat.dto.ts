import { IsArray, IsEnum, IsMongoId, IsString } from "class-validator"
import { ChatTypes } from "./chat.schema"
import { ObjectId, Types} from "mongoose"
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger"


export class CreateChatDTO {
    @ApiProperty({
        description: "the chat name, must unique"
    })
    @IsString()
    name: string

    @ApiProperty({
        description: "the chat title"
    })
    @IsString()
    title: string

    @ApiProperty({
        description:"chat type",
        enum:ChatTypes,
        enumName:"chat type"
    })
    @IsEnum(ChatTypes)
    type: ChatTypes
}

export class NewMemberDTO {

    @ApiProperty({
        description:"target chat objectId",
        type:String
    })
    @IsMongoId()
    chatId: ObjectId

    @ApiProperty({
        description:"list of new members objectId",
        type:[String]
    })
    @IsArray()
    @IsMongoId({ each: true })
    newMembers: ObjectId[]

}

export class ChatAbstractMember {
    @ApiResponseProperty()
    name: string
    @ApiResponseProperty()
    family: string
    @ApiResponseProperty()
    email: string
}

export class UserOwnChatListResponseDTO {
    @ApiResponseProperty({type:String})
    chatId: Types.ObjectId

    @ApiResponseProperty()
    name: string

    @ApiResponseProperty({enum:ChatTypes})
    type: ChatTypes

    @ApiResponseProperty()
    title: string

    @ApiResponseProperty({type:[ChatAbstractMember]})
    members: ChatAbstractMember[]
}

export class UserChatListResponseDTO {
    @ApiProperty({type:String})
    chatId: Types.ObjectId

    @ApiProperty({description:"number of messages that user has not seen"})
    numOfNotSawMessage: number

    @ApiProperty()
    abstractText: string
}

export class AbstractMessageDTO {
    chatId: Types.ObjectId
    messageNumber: number
    creator: Types.ObjectId
    abstractText: string
}



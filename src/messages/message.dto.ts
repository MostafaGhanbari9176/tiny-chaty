import { IsMongoId, IsNumber, IsString } from "class-validator"
import { ObjectId } from "mongoose"


export class CreateMessageDTO {

    @IsString()
    text: string

    @IsMongoId()
    chatId: ObjectId

}

export class ReplayMessageDTO {

    @IsString()
    replay: string

    @IsMongoId()
    chatId: ObjectId

    @IsMongoId()
    parentMessage: ObjectId

}


export class GetNextMessagesDTO {

    @IsMongoId()
    chatId: ObjectId

    @IsNumber()
    lastMessageNumber: Number

}

export class GetPreMessagesDTO {

    @IsMongoId()
    chatId: ObjectId

    @IsNumber()
    firstMessageNumber: Number

}


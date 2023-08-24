import { IsMongoId, IsString } from "class-validator"
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




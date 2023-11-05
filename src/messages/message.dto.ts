import { ApiProperty } from "@nestjs/swagger"
import { IsMongoId, IsNumber, IsString } from "class-validator"
import { ObjectId } from "mongoose"


export class CreateMessageDTO {

    @IsString()
    @ApiProperty()
    text: string

    @IsMongoId()
    @ApiProperty({type:String})
    chatId: ObjectId

}

export class ReplayMessageDTO {

    @IsString()
    @ApiProperty({type:String, description:"the replay message text"})
    replay: string

    @IsMongoId()
    @ApiProperty({type:String, description:"objectId of target chat"})
    chatId: ObjectId

    @IsMongoId()
    @ApiProperty({type:String, description:"objectId of  target message"})
    parentMessage: ObjectId

}


export class GetNextMessagesDTO {

    @IsMongoId()
    @ApiProperty({type:String})
    chatId: ObjectId

    @IsNumber()
    @ApiProperty({description:"then number of last message"})
    lastMessageNumber: Number

}

export class GetPreMessagesDTO {

    @IsMongoId()
    @ApiProperty({type:String})
    chatId: ObjectId

    @IsNumber()
    @ApiProperty({description:"then number of firs message"})
    firstMessageNumber: Number

}


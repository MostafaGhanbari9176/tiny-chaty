import { IsMongoId, IsString } from "class-validator"


export class CreateMessage{

    @IsString()
    text:string

    @IsMongoId()
    chatId:string

}




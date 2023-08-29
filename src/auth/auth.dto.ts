import { IsEmail, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class LoginDTO {

    @IsEmail()
    email: string

}

export class CheckOtpDTO {

    @IsEmail()
    email: string

    @IsString()
    otp: String

}

export class RegisterDTO {

    @IsEmail()
    email: string

    @IsString()
    username: string

    @IsString()
    name: string

    @IsString()
    family: string

    @IsString()
    otp: string

}

export class IdentifierDTO {

    userId: ObjectId

    email: string
    
}




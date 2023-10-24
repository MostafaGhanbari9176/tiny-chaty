import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class LoginDTO {

    @IsEmail()
    @ApiProperty({
        description:"user email",
        default:"e@ma.il"
    })
    email: string

}

export class CheckOtpDTO {

    @IsEmail()
    @ApiProperty({
        description:"user email",
        default:"e@ma.il"
    })
    email: string

    @IsString()
    @ApiProperty({
        description:"verification code that was sended to email",
    })
    otp: String

}

export class RegisterDTO {

    @IsEmail()
    @ApiProperty({
        description:"registered email, user identifier and must be unique",
        default:"e@ma.il"
    })
    email: string

    @IsString()
    @ApiProperty({
        description:"username must be unique",
        default:"mostafa"
    })
    username: string

    @IsString()
    @ApiProperty({
        description:"user first name",
        default:"mostafa"
    })
    name: string

    @IsString()
    @ApiProperty({
        description:"user second number",
        default:"ghanbari"
    })
    family: string

    @IsString()
    @ApiProperty({
        description:"otp code was sended to used email"
    })
    otp: string

}

export class IdentifierDTO {

    userId: ObjectId

    email: string
    
}




import { IsEmail, IsString } from "class-validator";

export class UpdateProfileDTO {

    @IsString()
    name: string

    @IsString()
    family: string

    @IsString()
    username: string

}

export class UserProfileResponseDTO {
    username: string
    name: string
    family: string
    email: string
}

export class UserSessionsResponseDTO {
    token: string
    createdAt: Date
    clientDetail: { name: string, ip: string }
}




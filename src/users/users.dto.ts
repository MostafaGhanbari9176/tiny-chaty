import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class UpdateProfileDTO {

    @IsString()
    @ApiProperty()
    name: string

    @IsString()
    @ApiProperty()
    family: string

    @IsString()
    @ApiProperty()
    username: string

}

export class UserProfileResponseDTO {
    @ApiResponseProperty()
    username: string
    
    @ApiResponseProperty()
    name: string
    
    @ApiResponseProperty()
    family: string
    
    @ApiResponseProperty()
    email: string
}

export class ClientSessionDetailResDTO{
    @ApiResponseProperty()
    name: string

    @ApiResponseProperty()
    ip: string
}

export class UserSessionsResponseDTO {
    @ApiResponseProperty()
    token: string

    @ApiResponseProperty()
    createdAt: Date

    @ApiResponseProperty({type:ClientSessionDetailResDTO})
    clientDetail: { name: string, ip: string }
}




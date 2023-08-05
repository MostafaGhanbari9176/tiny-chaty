import { IsEmail, IsString } from "class-validator";


export class UpdateProfileDTO {
    
    @IsString()
    name:string

    @IsString()
    family:string

    @IsString()
    username:string

}




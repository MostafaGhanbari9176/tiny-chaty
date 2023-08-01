import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly service:AuthService){}

    @Post('/requestOTP')
    requestOTP(@Body() loginData:LoginDTO){
        return this.service.sendOTP(loginData.email)
    }

}

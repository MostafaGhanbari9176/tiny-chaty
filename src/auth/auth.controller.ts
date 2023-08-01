import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from './auth.dto';

@Controller('auth')
export class AuthController {

    @Post('/requestOTP')
    requestOTP(@Body() email:LoginDTO){

    }

}

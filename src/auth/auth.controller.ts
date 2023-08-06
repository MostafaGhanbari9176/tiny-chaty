import { Body, Controller, Post, Req } from '@nestjs/common';
import { UnAuthRoutes } from 'src/decorator/auth.decorator';
import { CheckOtpDTO, LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';

@UnAuthRoutes()
@Controller('auth')
export class AuthController {

    constructor(private readonly service: AuthService) { }

    @Post('/requestOTP')
    requestOTP(@Body() loginData: LoginDTO) {
        return this.service.sendOTP(loginData.email)
        return {
            message: "Success"
        }
    }

    @Post('/checkOTP')
    async checkOTP(@Req() req:Request ,@Body() otpData: CheckOtpDTO) {
        const otpIsOK = await this.service.checkOTP(otpData)
        if (otpIsOK)
            return this.service.createUserIfNotExist(req, otpData.email)
    }

}

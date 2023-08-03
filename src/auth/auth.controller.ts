import { Body, Controller, Post } from '@nestjs/common';
import { UnAuthRoutes } from 'src/decorator/auth.decorator';
import { CheckOtpDTO, LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';

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
    async checkOTP(@Body() otpData: CheckOtpDTO) {
        const otpIsOK = await this.service.checkOTP(otpData)
        if (otpIsOK)
            return this.service.createUserIfNotExist(otpData.email)
    }

}

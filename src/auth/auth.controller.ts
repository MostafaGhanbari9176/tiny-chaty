import { Body, Controller, Post, Req } from '@nestjs/common';
import { UnAuthRoutes } from 'src/decorator/auth.decorator';
import { CheckOtpDTO, LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { SuccessResponseDTO } from 'src/dto/response.dto';

@UnAuthRoutes()
@Controller('auth')
export class AuthController {

    constructor(private readonly service: AuthService) { }

    @Post('/requestOTP')
    requestOTP(@Body() loginData: LoginDTO): Promise<SuccessResponseDTO> {
        return this.service.sendOTP(loginData.email)
    }

    @Post('/checkOTP')
    async checkOTP(@Req() req: Request, @Body() otpData: CheckOtpDTO): Promise<SuccessResponseDTO> {
        await this.service.checkOTP(otpData)
        
        return this.service.createUserIfNotExist(req, otpData.email)
    }

}

import { Body, Controller, Post, Req } from '@nestjs/common';
import { UnAuthRoutes } from 'src/decorator/auth.decorator';
import { CheckOtpDTO, LoginDTO, CheckOTPResponseDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { ErrorResponseDTO, SuccessResponseDTO } from 'src/dto/response.dto';
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from '@nestjs/swagger';

@UnAuthRoutes()
@ApiTags("Authentication")
@Controller('auth')
export class AuthController {

    constructor(private readonly service: AuthService) { }

    @Post('/requestOTP')
    @ApiOperation({ summary: "generating a new OTP", description: "this response used for creating new Token via `auth/checkOTP` for login, in now its not send the OTP via any interface, but in feature OTP its sended via email to user email" })
    @ApiResponse({ type: SuccessResponseDTO, status: 201 })
    requestOTP(@Body() loginData: LoginDTO): Promise<SuccessResponseDTO> {
        return this.service.sendOTP(loginData.email)
    }

    @Post('/checkOTP')
    @ApiOperation({ summary: "checking OPT ", description:"its check the OTP, if OTP is was ok, then return the Token" })
    @ApiResponse({ type: CheckOTPResponseDTO, status: 201 })
    @ApiBadRequestResponse({type: ErrorResponseDTO, description:"happens when OTP is `expired` or `wrong`"})
    async checkOTP(@Req() req: Request, @Body() otpData: CheckOtpDTO): Promise<CheckOTPResponseDTO> {
        await this.service.checkOTP(otpData)

        return this.service.createUserIfNotExist(req, otpData.email)
    }

}

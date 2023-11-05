import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDTO, UserProfileResponseDTO, UserSessionsResponseDTO } from './users.dto';
import { IdentifierDTO } from 'src/auth/auth.dto';
import { Identifier } from 'src/decorator/auth.decorator';
import { SuccessResponseDTO } from 'src/dto/response.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly service: UsersService) { }

    @Get('/profile')
    getProfile(@Identifier() identifier: IdentifierDTO): Promise<UserProfileResponseDTO> {
        return this.service.getProfile(identifier.userId)
    }

    @Post('/profile')
    updateProfile(@Body() newData: UpdateProfileDTO, @Identifier() identifier: IdentifierDTO): Promise<SuccessResponseDTO> {
        return this.service.updateProfile(identifier.userId, newData)
    }

    @Get('/sessions')
    getSessions(@Identifier() identifier: IdentifierDTO): Promise<UserSessionsResponseDTO[]> {
        return this.service.getSessions(identifier.userId)
    }

}


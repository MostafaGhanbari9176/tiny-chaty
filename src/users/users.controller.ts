import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDTO, UserProfileResponseDTO, UserSessionsResponseDTO } from './users.dto';
import { IdentifierDTO } from 'src/auth/auth.dto';
import { Identifier } from 'src/decorator/auth.decorator';
import { ErrorResponseDTO, SuccessResponseDTO } from 'src/dto/response.dto';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('User')
export class UsersController {

    constructor(private readonly service: UsersService) { }

    @Get('/profile')
    @ApiOperation({summary:"user profile detail"})
    @ApiNotFoundResponse({type:ErrorResponseDTO, description:"this exception throws when user not exist"})
    @ApiOkResponse({type:UserProfileResponseDTO})
    getProfile(@Identifier() identifier: IdentifierDTO): Promise<UserProfileResponseDTO> {
        return this.service.getProfile(identifier.userId)
    }

    @Post('/profile')
    @ApiOperation({summary:"update user profile, include username"})
    @ApiNotFoundResponse({type:ErrorResponseDTO, description:"this exception throws when user not exists"})
    @ApiBadRequestResponse({type:ErrorResponseDTO, description:"this exception throws when `username` is already used"})
    @ApiAcceptedResponse({type:SuccessResponseDTO})
    updateProfile(@Body() newData: UpdateProfileDTO, @Identifier() identifier: IdentifierDTO): Promise<SuccessResponseDTO> {
        return this.service.updateProfile(identifier.userId, newData)
    }

    @Get('/sessions')
    @ApiOperation({summary:"a list of user sessions"})
    @ApiNotFoundResponse({type:ErrorResponseDTO, description:"this exception throws when username is already used"})
    @ApiOkResponse({type:[UserSessionsResponseDTO]})
    getSessions(@Identifier() identifier: IdentifierDTO): Promise<UserSessionsResponseDTO[]> {
        return this.service.getSessions(identifier.userId)
    }

}


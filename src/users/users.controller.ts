import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { UpdateProfileDTO } from './users.dto';
import { IdentifierDTO } from 'src/auth/auth.dto';
import { Identifier } from 'src/decorator/auth.decorator';

@Controller('users')
export class UsersController {

    constructor(private readonly service: UsersService) { }

    @Get('/profile')
    getProfile(@Identifier() identifier: IdentifierDTO) {
        return this.service.getProfile(identifier.userId)
    }

    @Post('/profile')
    updateProfile(@Body() newData: UpdateProfileDTO, @Identifier() identifier: IdentifierDTO) {
        return this.service.updateProfile(identifier.userId, newData)
    }

    @Get('/sessions')
    getSessions(@Identifier() identifier: IdentifierDTO) {
        return this.service.getSessions(identifier.userId)
    }

}

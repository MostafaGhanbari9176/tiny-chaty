import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { UpdateProfileDTO } from './users.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly service:UsersService){}

    @Get('/profile')
    getProfile(@Req() req:any){
       return this.service.getProfile(req['user']['sub'])
    }

    @Post('/profile')
    updateProfile(@Body() newData:UpdateProfileDTO, @Req() req:any){
        console.log(`from profile ${JSON.stringify(newData)}`)
        return this.service.updateProfile(req['user']['sub'] ,newData)
    }

}

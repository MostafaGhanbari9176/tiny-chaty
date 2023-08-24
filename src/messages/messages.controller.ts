import { Body, Controller, Post, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDTO } from './message.dto';

@Controller('messages')
export class MessagesController {

    constructor(private readonly service:MessagesService){}

    @Post('/create')
    async createMessage(@Req() req:any, @Body() data:CreateMessageDTO){

        return await this.service.createMessage(req, data)

    }

}



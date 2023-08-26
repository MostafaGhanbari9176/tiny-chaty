import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDTO, GetNextMessagesDTO, GetPreMessagesDTO } from './message.dto';

@Controller('messages')
export class MessagesController {

    constructor(private readonly service: MessagesService) { }

    @Post('/create')
    async createMessage(@Req() req: any, @Body() data: CreateMessageDTO) {

        return await this.service.createMessage(req, data)

    }

    @Get('/:chatId/nextMessages/:lastMessageNumber')
    async nextMessages(
        @Req() req: any,
        @Param() data: GetNextMessagesDTO
    ) {

        return await this.service.nextMessages(req, data)

    }

    @Get('/:chatId/preMessages/:firstMessageNumber')
    async preMessages(
        @Req() req: any,
        @Param() data: GetPreMessagesDTO
    ) {

        return await this.service.previewsMessages(req, data)

    }

}



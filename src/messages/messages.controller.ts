import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDTO, GetNextMessagesDTO, GetPreMessagesDTO, ReplayMessageDTO } from './message.dto';
import { Identifier } from 'src/decorator/auth.decorator';
import { IdentifierDTO } from 'src/auth/auth.dto';

@Controller('messages')
export class MessagesController {

    constructor(private readonly service: MessagesService) { }

    @Post('/create')
    async createMessage(@Identifier() identifier: IdentifierDTO, @Body() data: CreateMessageDTO) {

        return await this.service.createMessage(identifier.userId, data)

    }

    @Get('/:chatId/nextMessages/:lastMessageNumber')
    async nextMessages(
        @Identifier() identifier: IdentifierDTO,
        @Param() data: GetNextMessagesDTO
    ) {

        return await this.service.nextMessages(identifier.userId, data)

    }

    @Get('/:chatId/preMessages/:firstMessageNumber')
    async preMessages(
        @Identifier() identifier: IdentifierDTO,
        @Param() data: GetPreMessagesDTO
    ) {

        return await this.service.previewsMessages(identifier.userId, data)

    }

    @Post('/replay')
    async replayMessage(@Identifier() identifier: IdentifierDTO, @Body() data: ReplayMessageDTO) {
        return this.service.replayMessage(identifier.userId, data)
    }

}



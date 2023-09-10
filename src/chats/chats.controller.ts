import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDTO, NewMemberDTO } from './chat.dto';
import { Identifier } from 'src/decorator/auth.decorator';
import { IdentifierDTO } from 'src/auth/auth.dto';


@Controller('chats')
export class ChatsController {

    constructor(private readonly service: ChatsService) { }

    @Post('create')
    createChat(@Identifier() identifier:IdentifierDTO, @Body() data: CreateChatDTO) {
        return this.service.createChat(identifier.userId, data)
    }

    @Post('newMember')
    async newMembers(@Identifier() identifier:IdentifierDTO, @Body() data: NewMemberDTO) {
        return await this.service.newMembers(identifier.userId, data)
    }

    @Get('/mine')
    getUserChats(@Identifier() identifier:IdentifierDTO) {
        return this.service.getUserChats(identifier.userId)
    }

    @Get('/list')
    getUserChatList(@Identifier() Identifier:IdentifierDTO) {
        return this.service.abstractOfUserChats(Identifier.userId)
    }

}

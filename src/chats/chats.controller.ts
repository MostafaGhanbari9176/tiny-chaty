import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDTO, NewMemberDTO } from './chat.dto';


@Controller('chats')
export class ChatsController {

    constructor(private readonly service: ChatsService) { }

    @Post('create')
    createChat(@Req() req: any, @Body() data: CreateChatDTO) {
        return this.service.createChat(req['user']['sub'], data)
    }

    @Post('newMember')
    async newMembers(@Req() req: any, @Body() data: NewMemberDTO) {
        return await this.service.newMembers(req['user']['sub'], data)
    }

    @Get('/mine')
    getUserChats(@Req() req: Request) {
        return this.service.getUserChats(req)
    }

}

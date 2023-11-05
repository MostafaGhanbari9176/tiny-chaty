import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDTO, NewMemberDTO, UserOwnChatListResponseDTO, UserChatListResponseDTO } from './chat.dto';
import { Identifier } from 'src/decorator/auth.decorator';
import { IdentifierDTO } from 'src/auth/auth.dto';
import { ApiBadRequestResponse, ApiExtraModels, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ErrorResponseDTO, SuccessResponseDTO, ListResponseDTO } from 'src/dto/response.dto';
import { ApiOkListResponse } from 'src/decorator/swagger.decoreator';


@Controller('chats')
@ApiTags("Chat")
export class ChatsController {

    constructor(private readonly service: ChatsService) { }

    @Post('create')
    @ApiOperation({ summary: "creating a new chat" })
    @ApiResponse({ type: SuccessResponseDTO, status: 201 })
    @ApiBadRequestResponse({ type: ErrorResponseDTO, description: "its happen when chat name is already exists, chat name must be unique" })
    createChat(@Identifier() identifier: IdentifierDTO, @Body() data: CreateChatDTO): Promise<SuccessResponseDTO> {
        return this.service.createChat(identifier.userId, data)
    }

    @Post('newMember')
    @ApiOperation({ summary: "adding new members to a chat" })
    @ApiResponse({ type: SuccessResponseDTO, status: 201 })
    @ApiNotFoundResponse({ type: ErrorResponseDTO, description: "happen when target chat is not exists" })
    @ApiBadRequestResponse({ type: ErrorResponseDTO, description: "this exception was throws for adding members to a private chat or some members id is wrong" })
    @ApiForbiddenResponse({ type: ErrorResponseDTO, description: "this exception throws when requester its not the chat owner" })
    async newMembers(@Identifier() identifier: IdentifierDTO, @Body() data: NewMemberDTO): Promise<SuccessResponseDTO> {
        return await this.service.newMembers(identifier.userId, data)
    }

    @Get('/mine')
    @ApiOperation({ summary: "list of chats was user owned" })
    @ApiOkListResponse(UserOwnChatListResponseDTO)
    getUserChats(@Identifier() identifier: IdentifierDTO): Promise<ListResponseDTO<UserOwnChatListResponseDTO>> {
        return this.service.getUserChats(identifier.userId)
    }

    @Get('/list')
    @ApiOperation({ summary: "a abstract list of all chats that was user is a member" })
    @ApiOkListResponse(UserChatListResponseDTO)
    getUserChatList(@Identifier() Identifier: IdentifierDTO): Promise<ListResponseDTO<UserChatListResponseDTO>> {
        return this.service.abstractOfUserChats(Identifier.userId)
    }

}

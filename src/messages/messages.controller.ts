import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDTO, GetNextMessagesDTO, GetPreMessagesDTO, ReplayMessageDTO } from './message.dto';
import { Identifier } from 'src/decorator/auth.decorator';
import { IdentifierDTO } from 'src/auth/auth.dto';
import { ErrorResponseDTO, ListResponseDTO, SuccessResponseDTO } from 'src/dto/response.dto';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkListResponse } from 'src/decorator/swagger.decoreator';
import { Message } from './message.schema';

@Controller('messages')
@ApiTags("Message")
export class MessagesController {

    constructor(private readonly service: MessagesService) { }

    @Post('/create')
    @ApiOperation({ summary: "posting a new message" })
    @ApiForbiddenResponse({ type: ErrorResponseDTO, description: "this exception throws when user is not access to this chat(its not a member)" })
    @ApiInternalServerErrorResponse({ type: ErrorResponseDTO, description: "this exception throws when storing message on server face to error" })
    @ApiCreatedResponse({ type: SuccessResponseDTO })
    async createMessage(@Identifier() identifier: IdentifierDTO, @Body() data: CreateMessageDTO): Promise<SuccessResponseDTO> {

        return await this.service.createMessage(identifier.userId, data)

    }

    @Get('/:chatId/nextMessages/:lastMessageNumber')
    @ApiOperation({ summary: "list of new messages" })
    @ApiOkListResponse(Message)
    async nextMessages(
        @Identifier() identifier: IdentifierDTO,
        @Param() data: GetNextMessagesDTO
    ): Promise<ListResponseDTO<Message>> {

        return await this.service.nextMessages(identifier.userId, data)

    }

    @Get('/:chatId/preMessages/:firstMessageNumber')
    @ApiOperation({summary:"list of old messages"})
    @ApiOkListResponse(Message)
    async preMessages(
        @Identifier() identifier: IdentifierDTO,
        @Param() data: GetPreMessagesDTO
    ):Promise<ListResponseDTO<Message>> {

        return await this.service.previewsMessages(identifier.userId, data)

    }

    @Post('/replay')
    @ApiOperation({summary:"replay to a message"})
    @ApiForbiddenResponse({type:ErrorResponseDTO, description:"this exception throws when user is not a member of chat "})
    @ApiInternalServerErrorResponse({type:ErrorResponseDTO, description:"this exception throws when storing reply on db face to a error"})
    @ApiCreatedResponse({type:SuccessResponseDTO})
    async replayMessage(@Identifier() identifier: IdentifierDTO, @Body() data: ReplayMessageDTO):Promise<SuccessResponseDTO> {
        return this.service.replayMessage(identifier.userId, data)
    }

}



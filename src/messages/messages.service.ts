import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMessageDTO, GetNextMessagesDTO, GetPreMessagesDTO, ReplayMessageDTO } from './message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './message.schema';
import { Model, ObjectId } from 'mongoose';
import { ListResponseDTO, SuccessResponseDTO } from 'src/dto/response.dto';
import { ChatsService } from 'src/chats/chats.service';

@Injectable()
export class MessagesService {

    constructor(
        @InjectModel(Message.name) private readonly messageModel: Model<Message>,
        private readonly chatService: ChatsService,
    ) { }

    /**
     * creating new message
     * 
     * @throws { @link ForbiddenException }
     * this exception throws when user is not access to this chat(its not a member)
     * 
     * @throws { @link InternalServerErrorException }
     * this exception throws when storing message on server face to error
     * 
     * @param creator 
     * @param data 
     * @returns the success response
     */
    async createMessage(creator: ObjectId, data: CreateMessageDTO): Promise<SuccessResponseDTO> {

        const canAccessToChat = this.chatService.canAccessToThisChat(creator, data.chatId)

        if (!canAccessToChat)
            throw new ForbiddenException("you can not access to this chat!")

        const messageNumber = await this.createMessageNumber(data.chatId)

        const newMessage = new this.messageModel({
            text: data.text,
            chatId: data.chatId,
            createdAt: new Date(),
            creator: creator,
            messageNumber: messageNumber
        })

        try {
            await newMessage.save()
            return new SuccessResponseDTO()
        } catch {
            throw new InternalServerErrorException()
        }
    }

    /**
     * getting a list of new messages
     * @param requester 
     * @param data 
     * @returns a list of new messages
     */
    async nextMessages(requester: ObjectId, data: GetNextMessagesDTO): Promise<ListResponseDTO<Message>> {

        if (!this.chatService.canAccessToThisChat(requester, data.chatId))
            throw new ForbiddenException("you cant access to this chat")


        const messages = await this.messageModel.find(
            {
                chatId: data.chatId,
                messageNumber: { $gt: data.lastMessageNumber }
            }).sort({ messageNumber: -1 }).limit(10).sort({ messageNumber: 1 })


        this.chatService.updateLastSawMessage(data.chatId, requester, messages[messages.length - 1].messageNumber)

        return new ListResponseDTO<Message>(messages)

    }

    /**
     * getting list of old messages
     * @param requester 
     * @param data 
     * @returns a list of old messages
     */
    async previewsMessages(requester: ObjectId, data: GetPreMessagesDTO): Promise<ListResponseDTO<Message>> {

        if (!this.chatService.canAccessToThisChat(requester, data.chatId))
            throw new ForbiddenException("you cant access to this chat")


        const messages = await this.messageModel.find(
            {
                chatId: data.chatId,
                messageNumber: { $lt: data.firstMessageNumber }
            }).limit(10).sort({ messageNumber: 1 }).exec()


        return new ListResponseDTO<Message>(messages)
    }

    /**
     * replying to a message
     * 
     * @throws { @link ForbiddenException }
     * this exception throws when user is not a member of chat 
     * 
     * @throws { @link InternalServerErrorException }
     * this exception throws when storing reply on db face to a error
     * 
     * @param requester 
     * @param data 
     * @returns the success response
     */
    async replayMessage(requester: ObjectId, data: ReplayMessageDTO): Promise<SuccessResponseDTO> {

        if (!this.chatService.canAccessToThisChat(requester, data.chatId))
            throw new ForbiddenException("you cant access to this chat")

        try {
            const newMessage = new this.messageModel({
                chatId: data.chatId,
                createdAt: new Date(),
                messageNumber: this.createMessageNumber(data.chatId),
                creator: requester,
                parentMessage: data.parentMessage,
                text: data.replay
            })

            await newMessage.save()

            return new SuccessResponseDTO()

        }
        catch {
            throw new InternalServerErrorException()
        }

    }

    /**
     * each message in a chat has a unique number as a counter
     * @param chatId 
     * @returns return new message number
     */
    private async createMessageNumber(chatId: ObjectId): Promise<number> {
        const lastMessageNumber = await this.messageModel
            .findOne(
                { chatId: chatId },
                { messageNumber: 1, _id: -1 }
            )
            .sort({ messageNumber: -1 })
            .limit(1)
            .exec()

        return (lastMessageNumber?.messageNumber ?? 0) + 1
    }


}



import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMessageDTO, GetNextMessagesDTO, GetPreMessagesDTO, ReplayMessageDTO } from './message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './message.schema';
import { Model, ObjectId } from 'mongoose';
import { FailedResponseDTO, ListResponseDTO, ResponseDTO, SuccessResponseDTO } from 'src/dto/response.dto';
import { ChatsService } from 'src/chats/chats.service';
import { count } from 'console';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Injectable()
export class MessagesService {

    constructor(
        @InjectModel(Message.name) private readonly messageModel: Model<Message>,
        private readonly chatService: ChatsService,
    ) { }

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



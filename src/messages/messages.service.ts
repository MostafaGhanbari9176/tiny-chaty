import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateMessageDTO, GetNextMessagesDTO, GetPreMessagesDTO, ReplayMessageDTO } from './message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './message.schema';
import { Model, ObjectId } from 'mongoose';
import { FailedResponseDTO, ListResponse, SuccessResponseDTO } from 'src/dto/response.dto';
import { ChatsService } from 'src/chats/chats.service';
import { count } from 'console';

@Injectable()
export class MessagesService {

    constructor(
        @InjectModel(Message.name) private readonly messageModel: Model<Message>,
        private readonly chatService: ChatsService
    ) { }

    async createMessage(req: any, data: CreateMessageDTO) {

        const creator = req['user']['sub']

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
            return new FailedResponseDTO()
        }

    }

    async nextMessages(req: any, data: GetNextMessagesDTO) {

        const requester = req['user']['sub']

        if (!this.chatService.canAccessToThisChat(requester, data.chatId))
            return new ForbiddenException("you cant access to this chat")


        const messages = this.messageModel.find(
            {
                chatId: data.chatId,
                messageNumber: { $gt: data.lastMessageNumber }
            }).limit(10).sort({ messageNumber: 1 })


        return new ListResponse(messages)

    }

    async previewsMessages(req: any, data: GetPreMessagesDTO) {
        const requester = req['user']['sub']

        if (!this.chatService.canAccessToThisChat(requester, data.chatId))
            return new ForbiddenException("you cant access to this chat")


        const messages = this.messageModel.find(
            {
                chatId: data.chatId,
                messageNumber: { $lt: data.firstMessageNumber }
            }).limit(10).sort({ messageNumber: 1 })


        return new ListResponse(messages)
    }

    async replayMessage(req: any, data: ReplayMessageDTO) {

        const requester = req['user']['sub']

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

        }
        catch {
            return new FailedResponseDTO()
        }

        return new SuccessResponseDTO()

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



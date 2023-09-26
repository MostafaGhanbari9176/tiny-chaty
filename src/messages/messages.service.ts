import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateMessageDTO, GetNextMessagesDTO, GetPreMessagesDTO, ReplayMessageDTO } from './message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './message.schema';
import { Model, ObjectId } from 'mongoose';
import { FailedResponseDTO, ListResponse, ResponseDTO, SuccessResponseDTO } from 'src/dto/response.dto';
import { ChatsService } from 'src/chats/chats.service';
import { count } from 'console';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Injectable()
export class MessagesService {

    constructor(
        @InjectModel(Message.name) private readonly messageModel: Model<Message>,
        private readonly chatService: ChatsService,
        private readonly notification:NotificationGateway
    ) { }

    async createMessage(creator:ObjectId, data: CreateMessageDTO) {

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
            this.notification.getServer().in(data.chatId.toString()).emit("new", data.text)
            return new SuccessResponseDTO()
        } catch(err) {
            return new ResponseDTO(err.message, false)
        }

    }

    async nextMessages(requester:ObjectId, data: GetNextMessagesDTO) {

        if (!this.chatService.canAccessToThisChat(requester, data.chatId))
            return new ForbiddenException("you cant access to this chat")


        const messages = await this.messageModel.find(
            {
                chatId: data.chatId,
                messageNumber: { $gt: data.lastMessageNumber }
            }).sort({ messageNumber: -1 }).limit(10).sort({ messageNumber: 1 })


        this.chatService.updateLastSawMessage(data.chatId, requester, messages[messages.length - 1].messageNumber)

        return new ListResponse(messages)

    }

    async previewsMessages(requester:ObjectId, data: GetPreMessagesDTO) {

        if (!this.chatService.canAccessToThisChat(requester, data.chatId))
            return new ForbiddenException("you cant access to this chat")


        const messages = this.messageModel.find(
            {
                chatId: data.chatId,
                messageNumber: { $lt: data.firstMessageNumber }
            }).limit(10).sort({ messageNumber: 1 })


        return new ListResponse(messages)
    }

    async replayMessage(requester:ObjectId, data: ReplayMessageDTO) {

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



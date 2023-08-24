import { Injectable } from '@nestjs/common';
import { CreateMessageDTO } from './message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './message.schema';
import { Model, ObjectId } from 'mongoose';
import { FailedResponseDTO, SuccessResponseDTO } from 'src/dto/response.dto';
import { ChatsService } from 'src/chats/chats.service';

@Injectable()
export class MessagesService {

    constructor(
        @InjectModel(Message.name) private readonly messageModel: Model<Message>
    ) { }

    async createMessage(req: any, data: CreateMessageDTO) {

        const creator = req['user']['sub']

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

    newMessagesList() {

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



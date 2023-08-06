import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Chat, ChatTypes } from './chat.schema';
import { CreateChatDTO, NewMemberDTO } from './chat.dto';
import { SuccessResponseDTO } from 'src/dto/response.dto';

@Injectable()
export class ChatsService {

    constructor(@InjectModel(Chat.name) private readonly chatModel: Model<Chat>) { }

    async createChat(creator: ObjectId, data: CreateChatDTO) {
        const newChat = new this.chatModel({
            id: data.id,
            name: data.name,
            type: data.type,
            creator: creator,
            createdAt: new Date(),
        })

        try {
            await newChat.save()
            return new SuccessResponseDTO()
        }
        catch {
            throw new BadRequestException("id duplication")
        }
    }

    async newMembers(requester: ObjectId, data: NewMemberDTO) {
        const chat = await this.chatModel.findOne({ id: data.chatId }).exec()
        if (!chat)
            throw new NotFoundException("chat not found")

        if (chat.creator != requester)
            throw new ForbiddenException("just creator can add new members")

        if (chat.type == ChatTypes.Private)
            throw new BadRequestException("you can add a new member to Private chat")

        chat.members.push(...data.newMembers)

        return chat.save()
    }

}

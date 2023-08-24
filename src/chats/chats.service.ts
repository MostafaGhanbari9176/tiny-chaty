import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Chat, ChatTypes } from './chat.schema';
import { CreateChatDTO, NewMemberDTO } from './chat.dto';
import { SuccessResponseDTO } from 'src/dto/response.dto';
import { User } from 'src/users/user.schema';

@Injectable()
export class ChatsService {

    constructor(
        @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) { }

    async createChat(creator: ObjectId, data: CreateChatDTO) {
        const newChat = new this.chatModel({
            name: data.name,
            title: data.title,
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
        const chat = await this.chatModel.findOne({ _id: data.chatId }).exec()
        if (!chat)
            throw new NotFoundException("chat not found")

        if (chat.creator != requester)
            throw new ForbiddenException("just creator can add new members")

        if (chat.type == ChatTypes.Private)
            throw new BadRequestException("you can add a new member to Private chat")

        const matchCount = await this.userModel.count({ _id: { $in: data.newMembers } })

        if (matchCount != data.newMembers.length)
            throw new BadRequestException("user ids wrong")

        //prevent of duplicated members by addToSet operator
        await chat.updateOne({ $addToSet: { members: { $each: data.newMembers } } })

        return new SuccessResponseDTO()
    }

    async getUserChats(@Req() req: any) {

        const userId = req['user']['sub']

        const chats = await this.chatModel.find({ creator: userId }).exec()

        const completeChats = {}

        for (let i = 0; i < chats.length; ++i) {

            const users = await this.userModel.find(
                { _id: { $in: chats[i].members } },
                { _id: 0, name: 1, family: 1, email: 1 }
            ).exec()

            return {
                chatId:chats[i]._id,
                name: chats[i].name,
                type: chats[i].type,
                title: chats[i].title,
                members: chats[i].members
            }

        }

        return completeChats
    }

}

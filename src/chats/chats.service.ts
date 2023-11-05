import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, ObjectId, Schema, Types } from 'mongoose';
import { Chat, ChatMember, ChatTypes } from './chat.schema';
import { AbstractMessageDTO, CreateChatDTO, NewMemberDTO, UserChatListResponseDTO, UserOwnChatListResponseDTO } from './chat.dto';
import { ListResponseDTO, SuccessResponseDTO } from 'src/dto/response.dto';
import { User } from 'src/users/user.schema';
import { Message } from 'src/messages/message.schema';

@Injectable()
export class ChatsService {

    constructor(
        @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Message.name) private readonly messageModel: Model<Message>
    ) { }

    /**
     * creating a new chat
     * 
     * @throws { @link BadRequestException }
     * this exception throws when chat name is duplicated, chat name must bu unique
     * 
     * @param creator id of user that create this chat
     * @param data chat data
     * @returns the success response
     */
    async createChat(creator: ObjectId, data: CreateChatDTO): Promise<SuccessResponseDTO> {
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

    /**
     * adding new members to a chat
     * 
     * @throws {NotFoundException}
     * throws this error when target chat is not exists
     * 
     * @throws {BadRequestException}
     * this exception was throws for adding members to a private chat or some members id is wrong
     * 
     * @throws {ForbiddenException}
     * this exception throws when requester its not the chat owner
     * 
     * @param requester id of user that try to add new members to chat
     * @param data target chat and members data
     * @returns the success response
     */
    async newMembers(requester: ObjectId, data: NewMemberDTO): Promise<SuccessResponseDTO> {
        const chat = await this.chatModel.findOne({ _id: data.chatId }).exec()
        if (!chat)
            throw new NotFoundException("chat not found")

        if (chat.creator != requester)
            throw new ForbiddenException("just creator can add new members")

        if (chat.type == ChatTypes.Private)
            throw new BadRequestException("you can not add a new member to Private chat")

        const matchCount = await this.userModel.count({ _id: { $in: data.newMembers } })

        if (matchCount != data.newMembers.length)
            throw new BadRequestException("user ids wrong")

        const chatMember = data.newMembers.map(member => { return { member: member, lastSawMessage: -1 } })

        //prevent of duplicated members by addToSet operator
        await chat.updateOne({ $addToSet: { members: { $each: chatMember } } })

        return new SuccessResponseDTO()
    }

    /**
     * return a list of chats was user owned
     * @param userId 
     * @returns a list of chats
     */ 
    async getUserChats(userId: ObjectId): Promise<ListResponseDTO<UserOwnChatListResponseDTO>> {

        const chats = await this.chatModel.find({ creator: userId }).exec()

        const completeChats: UserOwnChatListResponseDTO[] = []

        for (let i = 0; i < chats.length; ++i) {

            const membersId = chats[i].members.map(member => member.member)

            const users = await this.userModel.find(
                { _id: { $in: membersId } },
                { _id: 0, name: 1, family: 1, email: 1 }
            ).exec()

            completeChats.push(
                {
                    chatId: chats[i]._id,
                    name: chats[i].name,
                    type: chats[i].type,
                    title: chats[i].title,
                    members: users
                }
            )

        }

        return new ListResponseDTO<UserOwnChatListResponseDTO>(completeChats)
    }

    /**
     * update last saw message
     * @param chatId 
     * @param requester 
     * @param lastSawMessage 
     * 
     * @returns void
     */
    async updateLastSawMessage(chatId: ObjectId, requester: ObjectId, lastSawMessage: number): Promise<void> {
        const chat = await this.chatModel.findOne({ _id: chatId }).exec()

        const chatMember = chat?.members.find(member => member.member == requester)

        if (chatMember != null)
            chatMember.lastSawMessage = lastSawMessage

        await chat?.save()

    }

    /**
     * a abstract list of all chats that was user is a member
     * @param requester 
     * @returns a list of chats
     */
    async abstractOfUserChats(requester: ObjectId): Promise<ListResponseDTO<UserChatListResponseDTO>> {

        const chats = await this.chatModel.find({ "$members.member": requester }, { title: 1, members: 1 }).exec()

        const chatsId = chats.map(chat => chat._id)

        const abstractMessages = await this.abstractLastMessages(chatsId)

        const result: UserChatListResponseDTO[] = []

        chats.forEach(chat => {
            const member = chat.members.find(mem => mem.member == requester)
            const message = abstractMessages.find(abs => abs.chatId == chat._id)

            result.push({
                chatId: chat._id,
                numOfNotSawMessage: (message?.messageNumber ?? 0) - (member?.lastSawMessage ?? 0),
                abstractText: message?.abstractText ?? ""
            })

        });

        return new ListResponseDTO<UserChatListResponseDTO>(result)
    }

    /**
     * checking that the user is a member of chat
     * 
     * @param userId 
     * @param chatId 
     * @returns true if user is a member otherwise false
     */
    async canAccessToThisChat(userId: ObjectId, chatId: ObjectId): Promise<Boolean> {

        const chat = this.chatModel.findOne({ _id: chatId, members: userId })

        return chat != undefined

    }

    /**
     * checking that the user own a chat or not
     * 
     * @param userId 
     * @param chatId 
     * @returns true if user own this chat, otherwise false
     */
    async ownerOfThisChat(userId: ObjectId, chatId: ObjectId): Promise<Boolean> {

        const chat = this.chatModel.findOne({ _id: chatId, creator: userId }).exec()

        return chat != undefined

    }

    /**
     * @param userId 
     * @returns a list of user chats Id
     */
    async getUserChatsId(userId: ObjectId): Promise<Array<Types.ObjectId>> {

        const chats = await this.chatModel.find({ creator: userId }, { _id: 1 }).exec()
        return chats.map(chat => chat._id)

    }

    private calculateNumOfNotSawMessages(chats: Document<Chat>[], userId: ObjectId) {
        type resultType = { chatId: ObjectId, numOfNotSawMessages: number }
        const result: resultType[] = []



    }

    /**
     * @param chatsId target chats id
     * @returns a list of abstracted last message for every targets chat
     */
    private async abstractLastMessages(chatsId: Types.ObjectId[]): Promise<AbstractMessageDTO[]> {

        const messages = await this.messageModel.aggregate(
            [
                {
                    $match: { _id: { $in: chatsId } },
                    $sort: { messageNumber: -1 },
                    $limit: 1
                },
                {
                    $project: {
                        chatId: 1,
                        messageNumber: 1,
                        creator: 1,
                        abstractText: { $substrCP: ["$text", 0, 10] }
                    }
                }
            ]
        ).exec()

        return messages
    }

}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from './user.schema';
import { UpdateProfileDTO, UserProfileResponseDTO, UserSessionsResponseDTO } from './users.dto';
import { FailedResponseDTO, SuccessResponseDTO } from 'src/dto/response.dto';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

    /**
     * @throws { @link NotFoundException }
     * this exception throws when user not exist
     * 
     * @param targetId 
     * @returns the user profile detail
     */
    async getProfile(targetId: ObjectId): Promise<UserProfileResponseDTO> {
        const user = await this.userModel.findOne({ _id: targetId }, { _id: 0, sessions: 0 }).exec()

        if (!user)
            throw new NotFoundException("user not found")

        return user
    }

    /**
     * @throws { @link NotFoundException }
     * this exception throws when user not exists
     * 
     * @throws { @link BadRequestException }
     * this exception throws when username is already used
     * 
     * @param targetId 
     * @param newDate 
     * @returns the success response
     */
    async updateProfile(targetId: ObjectId, newDate: UpdateProfileDTO): Promise<SuccessResponseDTO> {
        const user = await this.userModel.findOne({ _id: targetId })

        if (!user)
            throw new NotFoundException("user not found")

        user.name = newDate.name
        user.family = newDate.family
        user.username = newDate.username

        try {
            await user.save({ validateBeforeSave: true })

            return new SuccessResponseDTO()
        }
        catch {
            throw new BadRequestException("username is already taken")
        }
    }

    /**
     * @throws { @link NotFoundException }
     * this exception throws when username is already used
     * 
     * @param targetId 
     * @returns a list of user sessions
     */
    async getSessions(targetId: ObjectId): Promise<UserSessionsResponseDTO[]> {
        const user = await this.userModel.findOne({ _id: targetId }, { _id: 0, sessions: 1 }).exec()

        if (!user)
            throw new NotFoundException("user not found")

        return user.sessions
    }

}

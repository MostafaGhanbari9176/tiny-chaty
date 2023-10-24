import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/user.schema';
import { CheckOtpDTO } from './auth.dto';
import { OTP } from './otp.schema';
import { Request } from 'express';
import { SuccessResponseDTO } from 'src/dto/response.dto';

@Injectable()
export class AuthService {

    private readonly otpLength = 6

    constructor(
        @InjectModel(OTP.name) private readonly otpModel: Model<OTP>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly jwtService: JwtService
    ) { }

    async sendOTP(email: string): Promise<SuccessResponseDTO> {
        const otp = await this.generateOTP()
        const otpObject = new this.otpModel({ code: otp, targetEmail: email, createdAt: new Date() })
        await otpObject.save()

        return new SuccessResponseDTO()
    }

    /**
     * @usageNotes
     * its check the otp, if that was notValid its throw exception, otherwise return @void asynchronously
     * 
     * @param otpData 
     */
    async checkOTP(otpData: CheckOtpDTO): Promise<void> {
        const otpObject = await this.otpModel.findOne({ targetEmail: otpData.email, code: otpData.otp }).exec()
        if (!otpObject)
            throw new BadRequestException("otp not found")

        console.log(JSON.stringify(otpObject))

        const now = new Date()
        const expireDate = otpObject.createdAt
        expireDate.setMinutes(expireDate.getMinutes() + 3)

        if (now > expireDate)
            throw new BadRequestException("otp is expired")
    }

    async createUserIfNotExist(req: Request, email: string): Promise<SuccessResponseDTO> {
        let user = await this.userModel.findOne({ email: email }).exec()
        if (!user)
            user = await this.createUser(email)

        const token = await this.jwtService.signAsync({ sub: user._id, email: email })

        user.sessions.push({
            clientDetail: {
                name: req.headers['user-agent'] ?? "unknown",
                ip: req.ip
            },
            createdAt: new Date(),
            token: token
        })

        await user.save()

        return new SuccessResponseDTO()
    }

    private async createUser(email: string) {
        const newUser = new this.userModel({ email: email })
        return newUser.save()
    }

    private async generateOTP() {
        const raw = "A1B2C3D4E6F7G9H8I1J2K3L45M60N0O9P8Q7R6S5T4U7V8W9X3Y1Z0"
        let otp = ""
        let cIndex = 0
        for (let i = 0; i < this.otpLength; ++i) {
            cIndex = Math.random() * (raw.length - 1)
            otp += raw[Math.ceil(cIndex)]
        }

        return otp

    }

}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OTP } from './otp.schema';

@Injectable()
export class AuthService {

    private readonly otpLength = 6

    constructor(@InjectModel(OTP.name) private readonly otpModel: Model<OTP>) { }


    async sendOTP(email: string) {
        const otp = await this.generateOTP()
        const otpObject =  new this.otpModel({code:otp, targetEmail:email})
        return otpObject.save()
    }


    private async generateOTP() {
        const raw = "A1B2C3D4E6F7G9H8I1J2K3L45M60N0O9P8Q7R6S5T4U7V8W9X3Y1Z0"
        let otp = ""
        let cIndex = 0
        for (let i = 0; i < this.otpLength; ++i) {
            cIndex = Math.random() * raw.length
            otp += raw[cIndex]
        }

        return otp

    }

}

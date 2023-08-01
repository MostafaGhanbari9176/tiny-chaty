import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OTP, OTPSchema } from './otp.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }])],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule { }

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OTP, OTPSchema } from './otp.schema';
import { JWTSecretKey } from './secrets';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }]),
        JwtModule.register({
            global:true,
            secret:JWTSecretKey,
        })
    ],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule { }

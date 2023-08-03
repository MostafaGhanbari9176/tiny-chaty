import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class OTP{

    @Prop()
    targetEmail:string

    @Prop()
    code:string

    @Prop({type:Date, required:true})
    createdAt:Date
    
}

export const OTPSchema = SchemaFactory.createForClass(OTP)


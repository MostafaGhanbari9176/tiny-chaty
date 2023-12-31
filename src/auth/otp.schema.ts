import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class OTP{

    @Prop({index:true})
    targetEmail:string

    @Prop()
    code:string

    @Prop({type:Date, required:true})
    createdAt:Date
    
}

export const OTPSchema = SchemaFactory.createForClass(OTP)


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

@Schema()
export class User{

    @Prop()
    username:string

    @Prop()
    family:string

    @Prop()
    email:string

}


export const UserSchema = SchemaFactory.createForClass(User)


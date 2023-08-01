import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

export class Session{
    
    token:string

    createdAt:Date

    clientDetail:{name:string, ip:string}
}

@Schema()
export class User{

    @Prop()
    username:string

    @Prop()
    family:string

    @Prop()
    email:string

    @Prop({type:Session})
    session:Session

}


export const UserSchema = SchemaFactory.createForClass(User)


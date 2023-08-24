import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

export class Session {

    token: string

    createdAt: Date

    clientDetail: { name: string, ip: string }
}

@Schema()
export class User {

    @Prop({ unique: true })
    username: string

    @Prop()
    name: string

    @Prop()
    family: string

    @Prop({ unique: true })
    email: string

    @Prop([Session])
    sessions: Session[]

}


export const UserSchema = SchemaFactory.createForClass(User)


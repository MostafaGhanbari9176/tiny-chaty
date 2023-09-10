import { ExecutionContext, SetMetadata, createParamDecorator } from "@nestjs/common"
import { ObjectId } from "mongoose"
import { IdentifierDTO } from "src/auth/auth.dto"

export const IS_PUBLIC_KEY = "isPublic"
export const UnAuthRoutes = () => SetMetadata(IS_PUBLIC_KEY, true)

export const Identifier = createParamDecorator(

    (field: any, ctx: ExecutionContext): IdentifierDTO => {

        const req = ctx.switchToHttp().getRequest()

        const user = req['user']

        return {
            userId: user["sub"],
            email: user["email"]
        }

    }

)


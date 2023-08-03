import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "src/decorator/auth.decorator";


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const unAuthedRoute = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        if (unAuthedRoute)
            return true

        const req = context.switchToHttp().getRequest()
        const token = this.fetchToken(req)

        if (!token)
            throw new UnauthorizedException()

        const payload = await this.jwtService.verifyAsync(token)
        req['user'] = payload

        return true
    }

    fetchToken(req: Request): string | undefined {
        const [type, token] = req.headers.authorization?.split("") ?? []
        return type == "Bearer" ? token : undefined
    }

}



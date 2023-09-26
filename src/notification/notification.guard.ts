import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IdentifierDTO } from 'src/auth/auth.dto';

@Injectable()
export class NotificationGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {


    const socket = context.switchToWs().getClient()
    const tokenObject = context.switchToWs().getData()
    const token = this.fetchToken(tokenObject)

    if (!token)
      throw new WsException("UnAuthorized")

    try {
      const payload = await this.jwtService.verify(token)
      const identifier: IdentifierDTO = { email: payload["email"], userId: payload["sub"] }
      socket["identifier"] = identifier
    }
    catch {
      throw new WsException("UnAuthorized")
    }

    return true;


  }

  fetchToken(tokenObject:{token:string}): string | undefined {
    const _token = tokenObject["token"]

    if (!_token)
      return undefined

    const [type, token] = (_token as string).split(" ")

    return type == "Bearer" ? token : undefined
  }
}

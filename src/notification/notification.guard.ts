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

    console.log("from notif guard")

    const socket = context.switchToWs().getClient()
    const tokenObject = context.switchToWs().getData()
    const token = this.fetchToken(tokenObject)

    if (!token)
      this.closeConnection(socket)

    try {
      const payload = await this.jwtService.verify(token)
      const identifier: IdentifierDTO = { email: payload["email"], userId: payload["sub"] }
      socket["identifier"] = identifier
    }
    catch {
      this.closeConnection(socket)
    }

    return true;


  }

  closeConnection(socket:Socket):never{
    socket.emit("exception", "Authentication Error")
    socket.disconnect(true)
    throw new WsException("UnAuthorized")
  }

  fetchToken(tokenObject:{token:string}): string | undefined {
    const _token = tokenObject["token"]

    if (!_token)
      return undefined

    const [type, token] = (_token as string).split(" ")

    return type == "Bearer" ? token : undefined
  }
}

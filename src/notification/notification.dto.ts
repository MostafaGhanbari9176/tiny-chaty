import { ApiProperty } from "@nestjs/swagger";

export class NotificationTokenDTO {
    @ApiProperty({
        description:"login Bearer token"
    })
    token: string
}


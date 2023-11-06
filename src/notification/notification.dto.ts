import { ApiProperty } from "@nestjs/swagger";

export class NotificationTokenDTO {
    @ApiProperty()
    token: string
}


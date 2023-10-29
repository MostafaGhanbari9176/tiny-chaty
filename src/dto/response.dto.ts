import { ApiResponseProperty } from "@nestjs/swagger"

export class ErrorResponseDTO {

    @ApiResponseProperty()
    readonly statusCode: number

    @ApiResponseProperty()
    readonly message: string

    @ApiResponseProperty()
    readonly error: string

}

export class ResponseDTO {
    @ApiResponseProperty()
    readonly message: string
    @ApiResponseProperty()
    readonly status: Boolean
    constructor(message: string, status: boolean) {
        this.message = message
        this.status = status
    }
}

export class SuccessResponseDTO extends ResponseDTO {
    constructor() {
        super("Success", true)
    }
}

export class FailedResponseDTO extends ResponseDTO {
    constructor(message: string = "Failed", readonly statusCode: number = 400) {
        super(message, false)
    }
}

export class ListResponseDTO<T> extends SuccessResponseDTO {

    constructor(
        private readonly data: T[]
    ) {
        super()
    }

}


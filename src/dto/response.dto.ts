export class ResponseDTO {
    constructor(readonly message: string, readonly status: boolean) { }
}

export class SuccessResponseDTO extends ResponseDTO {
    constructor() {
        super("Success", true)
    }
}

export class FailedResponseDTO extends ResponseDTO {
    constructor(message:string = "Failed", readonly statusCode:number = 400) {
        super(message, false)
    }
}

export class ListResponseDTO<T> extends SuccessResponseDTO {

    constructor(
        private readonly data:T[]
    ) {
        super()
    }

}


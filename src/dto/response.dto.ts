export class ResponseDTO {
    constructor(readonly message:string, readonly status:boolean){}
}

export class SuccessResponseDTO extends ResponseDTO {
    constructor(){
        super("Success", true)
    }
}

export class FailedResponseDTO extends ResponseDTO {
    constructor(){
        super("Failed", false)
    }
}


import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";

export class ObjectIdValidationPipe implements PipeTransform {

    transform(value: any, metadata: ArgumentMetadata): Types.ObjectId {
        if (Types.ObjectId.isValid(value))
            throw new Error("is not a objectId")

        return new Types.ObjectId(value)
    }

}


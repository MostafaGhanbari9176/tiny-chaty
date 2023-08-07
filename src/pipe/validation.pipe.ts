import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { plainToClass, plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export class ValidationPipe implements PipeTransform {

    async transform(value: any, { metatype }: ArgumentMetadata) {

        if (!metatype || !toValidate(metatype))
            return value

        const object = plainToInstance(metatype, value)
        const errors = await validate(object)

        if (errors.length > 0)
            throw new BadRequestException(errors)

        return value
    }

}

function toValidate(metatype: Function): Boolean {
    const types: Function[] = [String, Object, Boolean, Number, Array]
    return !types.includes(metatype)
}


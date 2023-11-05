import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { ListResponseDTO } from "src/dto/response.dto";

export const ApiOkListResponse = (dataDTO: Function) => applyDecorators(
    ApiExtraModels(ListResponseDTO, dataDTO),
    ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ListResponseDTO) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: getSchemaPath(dataDTO) }
                        }
                    }
                }
            ]
        }
    })
)


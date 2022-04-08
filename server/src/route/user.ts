import { BadRequest } from "@service/errors";

function getErrorIfDiffer(data: object, interf: object): null | BadRequest
{
    if (data instanceof interf)
        return null
    else
        return new BadRequest(interf)
}

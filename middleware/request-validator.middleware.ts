import {
    validate,
    ValidationErrors,
    ValidationRules,
} from "https://deno.land/x/validasaur/mod.ts";
import { httpErrors } from "https://deno.land/x/oak/mod.ts";
import { Context } from "./../types.ts";

const getErrorMessage = (
    errors: ValidationErrors,
): string | undefined => {
    for (let attr in errors) {
        const attrErrors = errors[attr];
        for (let rule in attrErrors) {
            return attrErrors[rule] as string;
        }
    }
};

const requestValidator = ({ bodyRules }: { bodyRules: ValidationRules }) => {
    return async (ctx: Context, next: () => Promise<void>) => {
        const request = ctx.request;
        const body = (await request.body({ type: 'json' }).value);

        const [isValid, errors] = await validate(body, bodyRules);
        if (!isValid) {
            const message = getErrorMessage(errors);
            throw new httpErrors.BadRequest(message);
        }

        await next();
    }
}

export { requestValidator }
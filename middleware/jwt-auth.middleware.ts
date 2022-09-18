import { getJwtPayload } from "../helpers/jwt.ts";
import { AuthUser, Context } from "../types.ts";

/***
 * JWTAuth middleware
 * Decode authorization bearer token
 * and attach as a user in application context
 */
const JWTAuthMiddleware = () => {
    return async (
        ctx: Context,
        next: () => Promise<void>,
    ) => {
        try {
            const authHeader = ctx.request.headers.get("Authorization");
            if (authHeader) {
                const token = authHeader.replace(/^bearer/i, "").trim();
                const user = await getJwtPayload(token);

                if (user) {
                    ctx.user = user as AuthUser;
                }
            }
        } catch (err) { }

        await next();
    };
}

export { JWTAuthMiddleware };
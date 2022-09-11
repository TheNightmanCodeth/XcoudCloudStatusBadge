import { Context } from "https://deno.land/x/oak/mod.ts";

import { UserSchema, createUser } from "../models/user.ts";

export const newUser = async (ctx: Context) => {
    const userData = (await ctx.request.body( { type: 'json' }).value) as UserSchema
    const user = await createUser(userData)
    if (user != undefined) {
        ctx.response.body = user
    }
}
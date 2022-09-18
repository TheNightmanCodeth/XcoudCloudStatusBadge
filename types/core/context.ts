import { Context as OakContext } from "https://deno.land/x/oak/mod.ts";
import { AuthUser } from "./../auth/auth-user.ts";

export class Context extends OakContext {
    user?: AuthUser;
}
import {
    Context,
    CreateUser,
    RefreshToken,
    LoginCredential,
} from "./../types.ts";
import {
    required,
    isEmail,
    lengthBetween,
} from "https://deno.land/x/validasaur/src/rules.ts";
import * as authService from "./../services/auth.service.ts";
import { requestValidator } from "../middleware/request-validator.middleware.ts";
import { httpErrors } from "https://deno.land/x/oak/mod.ts";

const registrationSchema = {
    username: [required],
    email: [required, isEmail],
    password: [required, lengthBetween(6, 12)],
};

const register = [
    requestValidator({ bodyRules: registrationSchema }),
    async (ctx: Context) => {
        const userData = (await ctx.request.body( { type: 'json' }).value) as CreateUser;
        const user = await authService.registerUser(userData);
        if (user != undefined) {
            ctx.response.body = user
        } else {
            ctx.response.status == 400
            ctx.response.body = { error: "User exists" }
        }
    }
]

const loginSchema = {
    email: [required, isEmail],
    password: [required, lengthBetween(6, 12)],
};

const login = [
    requestValidator({ bodyRules: loginSchema }),
    async (ctx: Context) => {
        const credential = (await ctx.request.body({ type: 'json'}).value) as LoginCredential;
        const token = await authService.loginUser(credential);
        ctx.response.body = token;
    },
];

const refreshTokenSchema = {
    refresh_token: [required],
};

const refreshToken = [
    requestValidator({ bodyRules: refreshTokenSchema }),
    async (ctx: Context) => {
        const data = (await ctx.request.body({ type: 'json' }).value) as RefreshToken;
        const token = await authService.refreshToken(data["refresh_token"],);
        ctx.response.body = token;
    },
];

export { login, register, refreshToken };
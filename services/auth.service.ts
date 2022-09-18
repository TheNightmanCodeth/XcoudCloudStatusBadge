import * as userRepo from "../models/user.ts"
import { httpErrors } from "https://deno.land/x/oak/mod.ts";
import * as encryption from "../helpers/encryption.ts";
import * as jwt from "../helpers/jwt.ts"
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";

import {
    CreateUser,
    LoginCredential,
    UserRole,
} from "../types.ts";

export const registerUser = async (userData: CreateUser) => {
    try {
        const { password } = userData;
        userData.password = await encryption.encrypt(password);
        const user: userRepo.UserSchema = {
            _id: new ObjectId(),
            email: userData.email,
            username: userData.username,
            password: userData.password,
            isActive: true,
            roles: [UserRole.USER],
            projects: [],
        }

        return await userRepo.createUser(user);
    } catch (err) {
        const { message } = err;
        if (message.match("email_unique")) {
            throw new httpErrors.BadRequest(
                `Already user exists with email ${userData.email}`,
            );
        }
        throw err;
    }
};

export const loginUser = async (credential: LoginCredential) => {
    const { email, password } = credential;
    const user = await userRepo.findUserByEmail(email);

    if (user) {
        if (user.isActive) {
            const passHash = user.password;
            const isValidPass = await encryption.compare(password, passHash)
            if (isValidPass) {
                return {
                    "access_token": await jwt.getAuthToken(user),
                    "refresh_token": await jwt.getRefreshToken(user),
                };
            }
        }
    }

    throw new httpErrors.Unauthorized("Wrong Credentials");
}

export const refreshToken = async (token: string) => {
    try {
        const payload = await jwt.getJwtPayload(token);
        if (payload) {
            const email = payload.email as string;
            const user = await userRepo.findUserByEmail(email);

            if (user) {
                if (!user.isActive) {
                    throw new httpErrors.Unauthorized("Inactive user status")
                }

                return {
                    "access_token": await jwt.getAuthToken(user),
                    "refresh_token": await jwt.getRefreshToken(user),
                };
            }
        }
    } catch (err) {
        throw new httpErrors.Unauthorized("Invalid token object");
    }
};
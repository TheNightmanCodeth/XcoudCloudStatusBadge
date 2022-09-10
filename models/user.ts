import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";

import { client } from "../db/db.ts";
import { ProjectSchema } from "./project.ts";

export interface UserSchema {
    _id: ObjectId;
    username: string;
    password: string;
    projects: ProjectSchema[];
}

const db = client.database("XcodeBadgeMaker");
const users = db.collection<UserSchema>("users");

export const createUser = async (user: UserSchema) => {
    if (await findUser(user._id) == undefined) {
        await users.insertOne(user);
        return await findUser(user._id)
    } else {
        return undefined
    }
}

export const findUser = async (id: ObjectId) => {
    return await users.findOne({ _id: id })
}

export const deleteUser = async (id: ObjectId) => {
    await users.deleteOne({ _id: id });
}

export const addProjectTo = async (id: ObjectId, project: ProjectSchema) => {
    const user = await users.findOne({ _id: id })
    user?.projects.push(project)
    users.updateOne({ _id: id }, { $set: { projects: user?.projects }})
}
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
    if (await users.findOne({ username: user.username }) == undefined) {
        await users.insertOne(user);
        return await findUser(user.username)
    } else {
        return undefined
    }
}

export const findUser = async (username: string) => {
    return await users.findOne({ username: username })
}

export const deleteUser = async (username: string) => {
    await users.deleteOne({ username: username });
}

export const addProjectTo = async (username: string, project: ProjectSchema) => {
    const user = await users.findOne({ username: username })
    user?.projects.push(project)
    users.updateOne({ username: username }, { $set: { projects: user?.projects }})
}

interface ProjectArgs {
    name?: string | undefined;
    buildStatus?: boolean | undefined;
    testsFailing?: number | undefined;
    testsPassing?: number | undefined;
}

export async function updateProject(username: string, projectName: string, args: ProjectArgs) {
    const user = await users.findOne({ username: username })
    const toUpdate = user!.projects.find(p => p.name == projectName)
    if (args.name != undefined) toUpdate!.name = args.name
    if (args.buildStatus != undefined) toUpdate!.buildStatus = args.buildStatus
    if (args.testsFailing != undefined) toUpdate!.testsFailing = args.testsFailing
    if (args.testsPassing != undefined) toUpdate!.testsPassing = args.testsPassing
    users.updateOne({ username: username }, { $set: { projects: user?.projects }})
}
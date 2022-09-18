import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";

import { client } from "../db/db.ts";
import { UserRole } from "../types.ts";
import { ProjectSchema } from "./project.ts";



export interface UserSchema {
    _id: ObjectId;
    email: string;
    username: string;
    password: string;
    isActive: boolean;
    roles: [UserRole];
    projects: ProjectSchema[];
}

const db = client.database("XcodeBadgeMaker");
const users = db.collection<UserSchema>("users");

export const createUser = async (user: UserSchema) => {
    if (await users.findOne({ username: user.username }) == undefined &&
        await users.findOne({ email: user.email }) == undefined) {
        await users.insertOne(user);
        return await findUserByUsername(user.username)
    } else {
        return undefined
    }
}

export const findUserByUsername = async (username: string) => {
    return await users.findOne({ username: username })
}

export const findUserByEmail = async (email: string) => {
    return await users.findOne({ email: email })
}

export const deleteUser = async (username: string) => {
    await users.deleteOne({ username: username });
}

export const addProjectTo = async (email: string, project: ProjectSchema) => {
    const user = await users.findOne({ email: email })
    user?.projects.push(project)
    users.updateOne({ email: email }, { $set: { projects: user?.projects }})
}

export const getUserProjects = async (email: string) => {
    const user = await users.findOne({ email: email })
    return user?.projects
}

interface ProjectArgs {
    name?: string | undefined;
    buildStatus?: boolean | undefined;
    testsFailing?: number | undefined;
    testsPassing?: number | undefined;
}

export async function updateProject(userEmail: string, projectId: string, args: ProjectArgs) {
    const user = await users.findOne({ email: userEmail })
    const toUpdate = user!.projects.find(p => p._id.toString() == projectId)
    if (toUpdate) {
        if (args.name != undefined) toUpdate!.name = args.name
        if (args.buildStatus != undefined) toUpdate!.buildStatus = args.buildStatus
        if (args.testsFailing != undefined) toUpdate!.testsFailing = args.testsFailing
        if (args.testsPassing != undefined) toUpdate!.testsPassing = args.testsPassing
        users.updateOne({ email: userEmail }, { $set: { projects: user?.projects }})
        return (await users.findOne({ email: userEmail }))?.projects.find(p => p._id.toString() == projectId);
    } else {
        return null
    }
}
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { findUserByEmail, addProjectTo } from "./user.ts";
export interface ProjectSchema {
    _id: ObjectId;
    name: string
    buildStatus?: boolean;
    testsFailing?: number;
    testsPassing?: number;
    belongsTo: ObjectId;
}

export const createProjectFor = async (email: string, projectName: string) => {
    const user = await findUserByEmail(email);
    if (user) {
        const proj = { 
            _id: new ObjectId(),
            name: projectName,
            belongsTo: user!._id
        }
        await addProjectTo(email, proj)
        return proj
    } else return null
}
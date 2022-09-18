import { Context } from "../types.ts";
import { userGuard } from "../middleware/user-guard.middleware.ts";
import { createProjectFor } from "../models/project.ts";
import { getUserProjects } from "../models/user.ts";

export const getProjects = [
    userGuard(),
    async(ctx: Context) => {
        const user = ctx.user
        if (user) {
            ctx.response.body = await getUserProjects(user.email);
        }
    }
]

export const createProject = [
    userGuard(),
    async(ctx: Context) => {
        const email = ctx.user?.email
        const projectName = ((await ctx.request.body({ type: 'json' }).value) as { name: string }).name;
        const project = await createProjectFor(email!, projectName);
        if (project) {
            ctx.response.status = 200
            ctx.response.body = project
        } else {
            ctx.response.status = 404
            ctx.response.body = { error: "User not found" }
        }
    }
]
import { Router } from "https://deno.land/x/oak/mod.ts";

import * as xcodeRoutes from "./xcode.routes.ts";
import * as badgeRoutes from "./badge.routes.ts";
import * as userRoutes from "./user.routes.ts";
import * as authRoutes from "./auth.routes.ts";
import { Context } from "../types.ts"
import { normalize } from "https://deno.land/std@0.152.0/path/win32.ts";

const router: Router = new Router();

router
    .post("/user/create-project", ...userRoutes.createProject)
    .post("/:projectId/builder", ...xcodeRoutes.postBuild)
    .post("/:projectId/builder/tests-passing", ...xcodeRoutes.postTestsPassing)
    .post("/auth/register", ...authRoutes.register) // VSCode is yelling at me but this is correct 🤷‍♂️
    .post("/auth/login", ...authRoutes.login)
    .post("/auth/refresh-token", ...authRoutes.refreshToken)

router
    .get("/user/projects", ...userRoutes.getProjects)
    .get("/:username/:projectId/badges/tests-badge", badgeRoutes.testsBadge)
    .get("/:username/:projectId/badges/build-status-badge", badgeRoutes.buildBadge)
    .get("/builder/post-inst", async (ctx: Context) => {
        let file;
        try {
            file = await Deno.open("./static/badger_get_testvals.sh", { read: true });
        } catch {
            ctx.response.status = 404
            ctx.response.body = "Couldn't find badger_get_testvals.sh on server"
            return
        }
        ctx.response.body = file.readable;
    })
    .get("/", (ctx: Context) => { ctx.response.body = "Hello, world!" })

export { router }
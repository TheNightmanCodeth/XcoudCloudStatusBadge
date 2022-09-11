import { Router, Context } from "https://deno.land/x/oak/mod.ts";

import * as xcodeRoutes from "./xcode.routes.ts";
import * as badgeRoutes from "./badge.routes.ts";
import * as userRoutes from "./user.routes.ts";

const router: Router = new Router();

router
    .post("/:username/:projectName/builder/", xcodeRoutes.postBuild)
    .post("/:username/:projectName/builder/tests-passing", xcodeRoutes.postTestsPassing)
    .post("/users/create", userRoutes.newUser)

router
    .get("/:username/:projectName/badges/tests-badge", badgeRoutes.testsBadge)
    .get("/:username/:projectName/badges/build-status-badge", badgeRoutes.buildBadge)
    .get("/", (ctx: Context) => { ctx.response.body = "Hello, world!" })

export { router }
import { Router } from "https://deno.land/x/oak/mod.ts";

import * as xcodeRoutes from "./xcode.routes.ts";
import * as badgeRoutes from "./badge.routes.ts";
import * as userRoutes from "./user.routes.ts";

const router: Router = new Router();

router
    .post("/:userId/:project/builder/", xcodeRoutes.postBuild)
    .post("/users/create", userRoutes.newUser)

router
    .get("/:userId/:project/badges/tests-badge", badgeRoutes.testsBadge)
    .get("/:userId/:project/badges/build-status-badge", badgeRoutes.buildBadge)

export { router }
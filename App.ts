import { Application } from "https://deno.land/x/oak/mod.ts";
import * as middlewares from "./middleware/middlewares.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { router } from "./routes/routes.ts";
import { Context } from "./types.ts";

const port = 8000;
const app = new Application<Context>();

app.use(oakCors());
app.use(middlewares.JWTAuthMiddleware());

app.use(router.routes());

await app.listen({ port });
import { Application } from "https://deno.land/x/oak/mod.ts";
import { router } from "./routes/routes.ts"

const port = 8000;
const app = new Application();

app.use(router.routes());

await app.listen({ port });
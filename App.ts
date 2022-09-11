import { Application } from "https://deno.land/x/oak/mod.ts";
import { router } from "./routes/routes.ts"

const port = 8000;
const app = new Application();

app.use(router.routes());

console.log("Starting server on http://localhost:8000/")

await app.listen({ port });
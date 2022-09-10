import { MongoClient } from "https://deno.land/x/mongo/mod.ts";

const client = new MongoClient();
await client.connect("mongodb://localhost:27017")

export { client }

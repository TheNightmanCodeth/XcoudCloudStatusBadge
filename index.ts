// Start listening on port 80
import { serve } from "https://deno.land/std@0.154.0/http/server.ts";

const port = 1337
let status = false;

async function reqHandler(req: Request) {
    if (req.url.endsWith("/builder")) {
        const json = await req.json()
        writeJson(json)
        const completionStatus = json.ciBuildRun.attributes["completionStatus"]
        if (completionStatus == "SUCCEEDED") {
            // Build success, publish passing badge
            console.log("success")
            status = true
        } else {
            // Build failing, publish failing badge
            status = false
        }
        return new Response(null, { status: 200 })
    } else if (req.url.endsWith("/badge")) {
        // Return passing badge
        const filepath = status ? "./passing.svg" : "./failing.svg"
        console.log(filepath)
        let file
        try {
            file = await Deno.open(filepath, { read: true })
        } catch {
            return new Response("404 not found", { status: 404 })
        }
        const readableStream = file.readable
        return new Response(readableStream, { headers: 
            { 
                "Content-Type": "image/svg+xml;charset=utf-8",
            }
        })
    } else if (req.url.endsWith("/out")) {
        let file
        try {
            file = await Deno.open("./out.json", { read: true })
        } catch {
            return new Response("No logs available yet.", { status: 404 })
        }
        return new Response(file?.readable)
    }
    return new Response(null, { status: 404 })
}

function writeJson(json: JSON): boolean {
    try {
        Deno.writeTextFileSync("./out.json", JSON.stringify(json))
        return true
    } catch (e) {
        console.log(e)
        return false
    }
}

serve(reqHandler, { port: port })
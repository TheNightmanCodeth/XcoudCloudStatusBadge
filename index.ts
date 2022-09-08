import { serve } from "https://deno.land/std@0.154.0/http/server.ts"
import * as etag from "https://deno.land/x/oak@v10.6.0/etag.ts";
import { XcodeCloudRequest } from "./models.ts"

const port = 1337

let testsFailed = 0
let buildStatus = false
let analyzerWarnings = 0

async function reqHandler(req: Request) {
    if (req.url.endsWith("/builder")) {
        const workflowData: XcodeCloudRequest = await req.json()
        parseWorkflow(workflowData)
        return new Response("Thank you, Xcode!", { status: 200 })
    } else if (req.url.endsWith("/badges/tests-status")) {
        const badgeColor = (testsFailed == 0) ? "green" : "red"
        const badgeUrl = `https://img.shields.io/badge/Tests-${testsFailed}%20Failing-${badgeColor}`
        const badgeSvg = await fetch(badgeUrl)
        const etagEntry = await etag.calculate(`teststatus${testsFailed}`)
        const expires = new Date()
        return new Response(badgeSvg.body, { headers:
            {
                'Expires': expires.toString(),
                'ETag': etagEntry,
                'Cache-Control': 'private, max-age=0, no-cache',
                'Content-Type': 'image/svg+xml;charset=utf-8',
                'Link': badgeUrl
            }
        })
    } else if (req.url.endsWith("/badges/build-status")) {
        const badgeColor = (buildStatus) ? "green" : "red"
        const badgeStatus = (buildStatus) ? "Passing" : "Failing"
        const badgeUrl = `https://img.shields.io/badge/Build-${badgeStatus}-${badgeColor}`
        const badgeSvg = await fetch(badgeUrl)
        const etagEntry = await etag.calculate(`buildstatus${badgeStatus}`)
        const expires = new Date()
        expires.setHours(expires.getHours() + 1)
        return new Response(badgeSvg.body, { headers: 
            {
                'Expires': expires.toString(),
                'ETag': etagEntry,
                'Cache-Control': 'private, max-age=0, no-cache',
                'Content-Type': 'image/svg+xml;charset=utf-8',
                'Link': badgeUrl
            }
        })
    }
    return new Response(null, { status: 404 })
}

/**
 * Parses request body from Xcode Cloud and sets values accordingly for badge generation
 * @param {XcodeCloudRequest} workflowData - The request body from Xcode Cloud
 */
function parseWorkflow(workflowData: XcodeCloudRequest) {
    workflowData.ciBuildActions.forEach(action => {
        switch (action.attributes.actionType) {
            case "TEST":
                testsFailed = action.attributes.issueCounts.testFailures
                break
            case "BUILD":
                buildStatus = (action.attributes.completionStatus == "SUCCESS")
                break
            case "ANALYZE":
                analyzerWarnings = action.attributes.issueCounts.analyzerWarnings
                break
            case "ARCHIVE":
                // TODO: Parse archive info
                break
            default:
                // What the heck is this
                console.log(`Got unexpected build action: ${action.attributes.actionType}`)
                break
        }
    })
}

serve(reqHandler, { port: port })
import { XcodeCloudRequest } from "../models/xcode.ts";
import { Context, helpers } from "https://deno.land/x/oak/mod.ts";

/** POST build status from Xcode Cloud */
export const postBuild = async (ctx: Context) => {
    const xcodeData = (await ctx.request.body( { type: 'json' }).value) as XcodeCloudRequest
    const { userId } = helpers.getQuery(ctx, { mergeParams: true })
    parseWorkflow(xcodeData, userId);
    ctx.response.body = "Thank you, Xcode"
}

/**
 * Parses request body from Xcode Cloud and sets values accordingly for badge generation
 * @param {XcodeCloudRequest} workflowData - The request body from Xcode Cloud
 */
 function parseWorkflow(workflowData: XcodeCloudRequest, user: string) {
    // Get user from db

    // Set values
    workflowData.ciBuildActions.forEach((action) => {
      switch (action.attributes.actionType) {
        case "TEST":
          // testsFailed = action.attributes.issueCounts.testFailures;
          break;
        case "BUILD":
          // buildStatus = action.attributes.completionStatus == "SUCCESS";
          break;
        case "ANALYZE":
          // analyzerWarnings = action.attributes.issueCounts.analyzerWarnings;
          break;
        case "ARCHIVE":
          // TODO: Parse archive info
          break;
      }
    });
  }
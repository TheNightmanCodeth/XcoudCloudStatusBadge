import { XcodeCloudRequest } from "../models/xcode.ts";
import { Context, helpers } from "https://deno.land/x/oak/mod.ts";
import { findUser, UserSchema } from "../models/user.ts";
import { ProjectSchema } from "../models/project.ts";
import { updateProject } from "../models/user.ts";

/** POST tests log from xcode cloud */
export const postTestsPassing = async (ctx: Context) => {
    const tests = (await ctx.request.body( { type: 'json' }).value) as { total: number, failing: number }
    const { username, projectName } = helpers.getQuery(ctx, { mergeParams: true })
    updateProject(username, projectName, { testsPassing: tests.total })
    ctx.response.body="Thanks, Joe!"
}

/** POST build status from Xcode Cloud */
export const postBuild = async (ctx: Context) => {
    const xcodeData = (await ctx.request.body( { type: 'json' }).value) as XcodeCloudRequest
    const { username, projectName } = helpers.getQuery(ctx, { mergeParams: true })
    const user = await findUser(username)
    const project = user?.projects.find(project => project.name == projectName)
    parseWorkflow(xcodeData, user!, project!);
    ctx.response.body = "Thank you, Xcode"
}

/**
 * Parses request body from Xcode Cloud and sets values accordingly for badge generation
 * @param {XcodeCloudRequest} workflowData - The request body from Xcode Cloud
 */
 function parseWorkflow(workflowData: XcodeCloudRequest, user: UserSchema, project: ProjectSchema) {
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
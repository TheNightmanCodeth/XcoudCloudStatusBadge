import { XcodeCloudRequest } from "../models/xcode.ts";
import { helpers } from "https://deno.land/x/oak/mod.ts";
import { findUserByEmail, UserSchema } from "../models/user.ts";
import { userGuard } from "../middleware/user-guard.middleware.ts";
import { ProjectSchema } from "../models/project.ts";
import { Context } from "../types.ts";
import { isNumber, required } from "https://deno.land/x/validasaur/mod.ts";
import { requestValidator } from "../middleware/request-validator.middleware.ts";
import { updateProject } from "../models/user.ts";

const postBuildSchema = {
  total: [required, isNumber],
  failing: [required, isNumber],
}
/** POST tests log from xcode cloud */
export const postTestsPassing = [
  userGuard(),
  requestValidator({ bodyRules: postBuildSchema }),
  async (ctx: Context) => {
    const tests = (await ctx.request.body( { type: 'json' }).value) as { total: number, failing: number }
    const { projectId } = helpers.getQuery(ctx, { mergeParams: true })
    const proj = await updateProject(ctx.user!.email, projectId, { testsPassing: tests.total, testsFailing: tests.failing })
    ctx.response.body = proj
  }
]

/** POST build status from Xcode Cloud */
export const postBuild = [
  userGuard(),
  async (ctx: Context) => {
    const xcodeData = (await ctx.request.body( { type: 'json' }).value) as XcodeCloudRequest
    const { projectId } = helpers.getQuery(ctx, { mergeParams: true })
    const user = await findUserByEmail(ctx.user?.email)
    const project = user?.projects.find(project => project._id.toString() == projectId)
    const res = await parseWorkflow(xcodeData, user!, project!);
    ctx.response.body = res
  }
]

/**
 * Parses request body from Xcode Cloud and sets values accordingly for badge generation
 * @param {XcodeCloudRequest} workflowData - The request body from Xcode Cloud
 */
async function parseWorkflow(workflowData: XcodeCloudRequest, user: UserSchema, project: ProjectSchema) {
  // Set values
  for await (const action of workflowData.ciBuildActions) {
    switch (action.attributes.actionType) {
      case "ARCHIVE": {
        const status = action.attributes.completionStatus == "SUCCEEDED"
        const proj = await updateProject(user.email, project._id.toString(), { buildStatus: status });
        if (proj != undefined) {
          return proj;
        }
        break;
      }
      case "ANALYZE":
        // analyzerWarnings = action.attributes.issueCounts.analyzerWarnings;
        break;
    }
  }
  return null;
}
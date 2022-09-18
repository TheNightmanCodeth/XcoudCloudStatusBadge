import { helpers } from "https://deno.land/x/oak/mod.ts";

import * as users from "../models/user.ts";
import { Context } from "../types.ts"

type ResponseHeader = {
    key: string
    value: string
}

const responseHeaders: ResponseHeader[] = [
    { key: "Cache-Control", value: "no-cache" },
    { key: "Content-Type", value: "image/svg+xml;charset=utf-8" },
]

export const testsBadge = async (ctx: Context) => {
    const { username, projectId } = helpers.getQuery(ctx, { mergeParams: true })
    const user = await users.findUserByUsername(username)
    const project = user?.projects.find(project => project._id.toString() == projectId)
    const testsFailed = project?.testsFailing
    const testsPassed = project?.testsPassing
    
    const badgeColor = (testsFailed == 0) ? "green" : "red";
    const badgeUrl =
      `https://img.shields.io/badge/Tests-${testsFailed}%20Failing%2C%20${testsPassed}%20Passing-${badgeColor}`;
    const badgeSvg = await fetch(badgeUrl);

    setHeaders(ctx)

    ctx.response.body = badgeSvg.body
}

export const buildBadge = async (ctx: Context) => {
    const { username, projectId } = helpers.getQuery(ctx, { mergeParams: true })
    const user = await users.findUserByUsername(username)
    const project = user?.projects.find(project => project._id.toString() == projectId)
    const buildStatus = project?.buildStatus

    const badgeColor = (buildStatus) ? "green" : "red";
    const badgeStatus = (buildStatus) ? "Passing" : "Failing";
    const badgeUrl =
      `https://img.shields.io/badge/Build-${badgeStatus}-${badgeColor}`;
    const badgeSvg = await fetch(badgeUrl);

    setHeaders(ctx)

    ctx.response.body = badgeSvg.body
}

function setHeaders(ctx: Context) {
    responseHeaders.forEach((header) => {
        ctx.response.headers.set(header.key, header.value)
    })
}
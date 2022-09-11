import { Context, helpers } from "https://deno.land/x/oak/mod.ts";

import * as users from "../models/user.ts";

type ResponseHeader = {
    key: string
    value: string
}

const responseHeaders: ResponseHeader[] = [
    { key: "Cache-Control", value: "no-cache" },
    { key: "Content-Type", value: "image/svg+xml;charset=utf-8" },
]

export const testsBadge = async (ctx: Context) => {
    const { username, projectName } = helpers.getQuery(ctx, { mergeParams: true })
    const user = await users.findUser(username)
    const project = user?.projects.find(project => project.name == projectName)
    const testsFailed = project?.testsFailing
    
    const badgeColor = (testsFailed == 0) ? "green" : "red";
    const badgeUrl =
      `https://img.shields.io/badge/Tests-${testsFailed}%20Failing-${badgeColor}`;
    const badgeSvg = await fetch(badgeUrl);

    setHeaders(ctx)

    ctx.response.body = badgeSvg.body
}

export const buildBadge = async (ctx: Context) => {
    const { username, projectName } = helpers.getQuery(ctx, { mergeParams: true })
    const user = await users.findUser(username)
    const project = user?.projects.find(project => project.name == projectName)
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